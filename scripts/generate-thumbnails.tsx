import path from 'node:path'
import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import { ArticleFrontmatterSchema } from './lib/article-schema'
import type { ArticleFrontmatter } from './lib/article-schema'
import {
  BACKGROUND_PATH,
  CONTENT_DIR,
  FONT_BOLD_PATH,
  FONT_REGULAR_PATH,
  GENERATED_ARTICLES_PATH,
  ROOT,
  THUMBNAILS_DIR,
} from './lib/article-paths'
import type { GeneratedArticle } from './lib/article-types'
import { calculateReadingTime, normalizeTags } from './lib/article-utils'
import { renderArticleThumbnail } from './lib/article-thumbnail'
import { ensureCleanDir, toDataUrl } from './lib/file-utils'
import { writeGeneratedArticles } from './lib/generated-articles'
import { markdownToHtml } from './lib/markdown'
import { formatDate } from '../src/lib/date'
import { getArticleFiles } from './lib/article-files'
import { processArticleImages } from './lib/article-images'

const ARTICLE_ASSETS_DIR = path.join(ROOT, 'public/article-assets')

async function main() {
  const backgroundDataUrl = await toDataUrl(BACKGROUND_PATH, 'image/png')
  const regularFont = await fs.readFile(FONT_REGULAR_PATH)
  const boldFont = await fs.readFile(FONT_BOLD_PATH)

  const articleFiles = await getArticleFiles(CONTENT_DIR)
  const articles: GeneratedArticle[] = []

  await ensureCleanDir(THUMBNAILS_DIR)
  await ensureCleanDir(ARTICLE_ASSETS_DIR)

  const publishedArticles: {
    slug: string
    articleDir: string
    frontmatter: ArticleFrontmatter
    content: string
  }[] = []

  for (const articleFile of articleFiles) {
    const raw = await fs.readFile(articleFile.filePath, 'utf8')
    const { data, content } = matter(raw)

    const parsed = ArticleFrontmatterSchema.safeParse(data)

    if (!parsed.success) {
      console.error(
        `Invalid frontmatter in ${articleFile.filePath}:`,
        parsed.error.format(),
      )
      process.exit(1)
    }

    if (parsed.data.draft && process.env.INCLUDE_DRAFTS !== 'true') {
      console.log(`skipped (draft): ${articleFile.filePath}`)
      continue
    }

    publishedArticles.push({
      slug: articleFile.slug,
      articleDir: articleFile.articleDir,
      frontmatter: parsed.data,
      content,
    })
  }

  const articlesBySlug = new Map(
    publishedArticles.map((article) => [
      article.slug,
      { slug: article.slug, title: article.frontmatter.title },
    ]),
  )

  for (const { slug, articleDir, frontmatter, content } of publishedArticles) {
    const tags = normalizeTags(frontmatter.tags)
    const formattedDate = formatDate(frontmatter.date)

    const processedContent = await processArticleImages({
      markdown: content,
      articleDir,
      slug,
    })

    const { html, toc } = await markdownToHtml(processedContent, {
      resolveArticle: (target) => articlesBySlug.get(target) ?? null,
      onUnresolved: (source) =>
        console.warn(`unresolved wikilink in ${slug}: ${source}`),
    })

    const webp = await renderArticleThumbnail({
      title: frontmatter.title,
      tags,
      date: formattedDate,
      backgroundDataUrl,
      regularFont,
      boldFont,
    })

    const outputPath = path.join(THUMBNAILS_DIR, `${slug}.webp`)

    await fs.writeFile(outputPath, webp)
    console.log(`generated: ${path.relative(ROOT, outputPath)}`)

    articles.push({
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      tags,
      pin: frontmatter.pin,
      thumbnail: `/article-thumbs/${slug}.webp`,
      body: processedContent,
      html,
      toc,
      readingTime: calculateReadingTime(processedContent),
    })
  }

  articles.sort((a, b) => b.date.localeCompare(a.date))

  await writeGeneratedArticles(GENERATED_ARTICLES_PATH, articles)
  console.log('generated: src/generated/articles.ts')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

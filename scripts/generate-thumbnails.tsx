import path from 'node:path'
import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import { ArticleFrontmatterSchema } from './lib/article-schema'
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
import {
  calculateReadingTime,
  isArticleFile,
  normalizeTags,
  slugFromFileName,
} from './lib/article-utils'
import { renderArticleThumbnail } from './lib/article-thumbnail'
import { ensureCleanDir, toDataUrl } from './lib/file-utils'
import { writeGeneratedArticles } from './lib/generated-articles'
import { markdownToHtml } from './lib/markdown'
import { formatDate } from '../src/lib/date'

async function main() {
  const backgroundDataUrl = await toDataUrl(BACKGROUND_PATH, 'image/png')
  const regularFont = await fs.readFile(FONT_REGULAR_PATH)
  const boldFont = await fs.readFile(FONT_BOLD_PATH)

  const fileNames = await fs.readdir(CONTENT_DIR)
  const articleFiles = fileNames.filter(isArticleFile)
  const articles: GeneratedArticle[] = []

  await ensureCleanDir(THUMBNAILS_DIR)

  for (const fileName of articleFiles) {
    const slug = slugFromFileName(fileName)
    const filePath = path.join(CONTENT_DIR, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(raw)
    const parsed = ArticleFrontmatterSchema.safeParse(data)

    if (!parsed.success) {
      console.error(
        `Invalid frontmatter in ${filePath}:`,
        parsed.error.format(),
      )
      process.exit(1)
    }

    const frontmatter = parsed.data

    if (frontmatter.draft) {
      console.log(`skipped (draft): ${filePath}`)
      continue
    }

    const title = frontmatter.title
    const date = formatDate(frontmatter.date)
    const tags = normalizeTags(frontmatter.tags)
    const { html, toc } = await markdownToHtml(content)
    const webp = await renderArticleThumbnail({
      title,
      tags,
      date,
      backgroundDataUrl,
      regularFont,
      boldFont,
    })
    const outputPath = path.join(THUMBNAILS_DIR, `${slug}.webp`)

    await fs.writeFile(outputPath, webp)
    console.log(`generated: ${path.relative(ROOT, outputPath)}`)

    articles.push({
      slug,
      title,
      description: frontmatter.description,
      date: frontmatter.date,
      tags,
      pin: frontmatter.pin,
      thumbnail: `/article-thumbs/${slug}.webp`,
      body: content,
      html,
      toc,
      readingTime: calculateReadingTime(content),
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

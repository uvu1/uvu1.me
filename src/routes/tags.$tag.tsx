import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { PageLayout } from '../components/layout/PageLayout'
import { ArticleListItem } from '../components/article/ArticleListItem'
import { getAllTags, getArticlesByTag } from '../lib/articles'
import { siteConfig } from '../config/site'
import { createSeo } from '../lib/seo'

export const Route = createFileRoute('/tags/$tag')({
  head: ({ params }) => {
    const tag = decodeURIComponent(params.tag)
    const encodedTag = encodeURIComponent(tag)

    return createSeo({
      title: `#${tag} | ${siteConfig.name}`,
      description: `#${tag} の記事一覧です。`,
      path: '/tags/' + encodedTag,
    })
  },
  component: TagPage,
})

function TagPage() {
  const { tag } = Route.useParams()
  const decodedTag = decodeURIComponent(tag)

  const articles = getArticlesByTag(decodedTag)
  const allTags = getAllTags()

  const exists = allTags.some((t) => t.name === decodedTag)

  if (!exists) {
    throw notFound()
  }

  return (
    <PageLayout maxWidth="md">
      <div className="mb-8">
        <Link
          to="/"
          className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
        >
          ← Home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-[var(--muted)]">Tag Archive</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
            #{decodedTag}
          </h1>

          <p className="mt-3 text-sm text-[var(--muted)]">
            {articles.length} articles
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="border-t border-[var(--border)] py-12">
          <p className="text-sm text-[var(--muted)]">
            このタグの記事はまだありません。
          </p>
        </div>
      ) : (
        <div className="space-y-3 border-t border-[var(--border)] pt-6 @container">
          {articles.map((article) => (
            <ArticleListItem key={article.slug} article={article} />
          ))}
        </div>
      )}
    </PageLayout>
  )
}

import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArticleActionRail } from '../../components/article/ArticleActionRail'
import { ArticleBody } from '../../components/article/ArticleBody'
import { ArticleMetaCards } from '../../components/article/ArticleMetaCards'
import { ArticleMobileActions } from '../../components/article/ArticleMobileActions'
import { ArticleNavigation } from '../../components/article/ArticleNavigation'
import { ArticleToc } from '../../components/article/ArticleToc'
import { CodeCopyController } from '../../components/article/CodeCopyController'
import { ArticleActionsProvider } from '../../components/article/useArticleActions'
import { PageLayout } from '../../components/layout/PageLayout'
import { TagPill } from '../../components/ui/TagPill'
import { siteConfig } from '../../config/site'
import { getArticleBySlug, getAdjacentArticles } from '../../lib/articles'
import { createSeo } from '../../lib/seo'

export const Route = createFileRoute('/articles/$slug')({
  head: ({ params }) => {
    const article = getArticleBySlug(params.slug)

    if (!article) {
      return {
        meta: [{ title: `Article Not Found | ${siteConfig.name}` }],
      }
    }

    const description = article.description || `${article.title} の記事です。`
    const image = new URL(article.thumbnail, siteConfig.url).toString()

    return createSeo({
      title: `${article.title} | ${siteConfig.name}`,
      description,
      path: `articles/${article.slug}`,
      type: 'article',
      image,
    })
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { slug } = Route.useParams()

  const article = getArticleBySlug(slug)

  if (!article) {
    throw notFound()
  }
  const { newerArticle, olderArticle } = getAdjacentArticles(slug)

  return (
    <PageLayout maxWidth="xl">
      <ArticleActionsProvider slug={article.slug} title={article.title}>
        <ArticleActionRail />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,820px)_240px] lg:justify-center">
          <article className="glass-card w-full min-w-0 rounded-[2rem] p-5 sm:p-8">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
            >
              ← Home
            </Link>

            <header className="mt-8">
              <div className="mt-7 sm:mt-8">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
                  {article.title}
                </h1>

                {article.description && (
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
                    {article.description}
                  </p>
                )}

                {article.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <TagPill key={tag} name={tag} to="tag" size="md" />
                    ))}
                  </div>
                )}

                <ArticleMetaCards
                  date={article.date}
                  readingTime={article.readingTime}
                />
              </div>
            </header>

            <CodeCopyController />

            <ArticleBody html={article.html} />

            <ArticleMobileActions />

            <ArticleNavigation
              newerArticle={newerArticle}
              olderArticle={olderArticle}
            />
          </article>

          <div className="hidden lg:block">
            <ArticleToc toc={article.toc} />
          </div>
        </div>
      </ArticleActionsProvider>
    </PageLayout>
  )
}

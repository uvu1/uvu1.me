import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "../../components/layout/PageLayout";
import { ArticleBody } from "../../components/article/ArticleBody";
import { ArticleNavigation } from "../../components/article/ArticleNavigation";
import { ArticleToc } from "../../components/article/ArticleToc";
import { TagPill } from "../../components/ui/TagPill";
import { getAdjacentArticles, getArticleBySlug } from "../../lib/articles";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    const article = getArticleBySlug(params.slug);

    if (!article) {
      return {
        meta: [{ title: "Article Not Found | uvu1.me" }],
      };
    }

    const title = `${article.title} | uvu1.me`;
    const description = article.description || `${article.title}の記事です。`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: article.thumbnail },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: article.thumbnail },
      ],
    };
  },
  component: ArticlePage,
});

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    throw notFound();
  }

  const { olderArticle, newerArticle } = getAdjacentArticles(slug);

  return (
    <PageLayout maxWidth="lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="mx-auto w-full max-w-3xl">
          <Link
            to="/"
            className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
          >
            ← Home
          </Link>

          <header className="mt-8">
            <div className="mt-8">
              <time className="text-sm text-[var(--muted)]">
                {formatDate(article.date)}
              </time>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)]">
                {article.title}
              </h1>

              {article.description && (
                <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                  {article.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <TagPill key={tag} name={tag} to="tag" size="md" />
                ))}
              </div>
            </div>
          </header>

          <ArticleBody html={article.html} />

          <ArticleNavigation
            olderArticle={olderArticle}
            newerArticle={newerArticle}
          />
        </article>

        <div className="relative z-50 hidden lg:block">
          <ArticleToc toc={article.toc} />
        </div>
      </div>
    </PageLayout>
  );
}

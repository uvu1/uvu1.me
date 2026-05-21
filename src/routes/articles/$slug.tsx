import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "../../components/layout/PageLayout";
import { ArticleBody } from "../../components/article/ArticleBody";
import { ArticleNavigation } from "../../components/article/ArticleNavigation";
import { ArticleToc } from "../../components/article/ArticleToc";
import { TagPill } from "../../components/ui/TagPill";
import { getAdjacentArticles, getArticleBySlug } from "../../lib/articles";
import { CodeCopyController } from "../../components/article/CodeCopyController";
import { ArticleMetaCards } from "../../components/article/ArticleMetaCards";
import { ArticleActionRail } from "../../components/article/ArticleActionRail";
import { siteConfig } from "../../config/site";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    const article = getArticleBySlug(params.slug);

    if (!article) {
      return {
        meta: [{ title: "Article Not Found | uvu1.me" }],
      };
    }

    const url = `${siteConfig.url}/articles/${article.slug}`;
    const title = `${article.title} | ${siteConfig.name}`;
    const description =
      article.description || `${article.title}の記事です。`;
    const image = new URL(article.thumbnail, siteConfig.url).toString();

    return {
      meta: [
        { title },
        { name: "description", content: description },

        { property: "og:site_name", content: siteConfig.name },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [
        {
          rel: "canonical",
          href: url,
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    throw notFound();
  }

  const { olderArticle, newerArticle } = getAdjacentArticles(slug);

  return (
    <PageLayout maxWidth="xl">
      <ArticleActionRail
        slug={article.slug}
        title={article.title}
      />
      <div className="ml-28 grid gap-10 lg:grid-cols-[minmax(0,920px)_260px] lg:justify-center">
        <article className="w-full max-w-[920px] rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/70 p-8 shadow-[0_18px_60px_rgba(127,183,232,0.16)] backdrop-blur-xl">
          <Link
            to="/"
            className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
          >
            ← Home
          </Link>

          <header className="mt-8">
            <div className="mt-8">
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

              <ArticleMetaCards
                date={article.date}
                readingTime={article.readingTime}
              />
            </div>
          </header>

          <CodeCopyController />
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

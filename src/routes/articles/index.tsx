import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "../../components/layout/PageLayout";
import { ArticleListItem } from "../../components/article/ArticleListItem";
import { getArchiveArticles } from "../../lib/articles";
import { siteConfig } from "../../config/site";

export const Route = createFileRoute("/articles/")({
  head: () => {
    const title = `Articles | ${siteConfig.name}`;
    const description = "uvu1.me の記事一覧です。";
    const url = `${siteConfig.url}/articles`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${siteConfig.url}/ogp.png` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${siteConfig.url}/ogp.png` },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ArticlesPage,
});

function ArticlesPage() {
  const articles = getArchiveArticles();

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
          <p className="text-sm font-medium text-[var(--muted)]">
            Article Archive
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
            Articles
          </h1>

          <p className="mt-3 text-sm text-[var(--muted)]">
            {articles.length} articles
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-6">
        {articles.map((article) => (
          <ArticleListItem key={article.slug} article={article} />
        ))}
      </div>
    </PageLayout>
  );
}

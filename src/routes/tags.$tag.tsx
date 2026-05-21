import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageLayout } from "../components/layout/PageLayout";
import { ArticleListItem } from "../components/article/ArticleListItem";
import { getAllTags, getArticlesByTag } from "../lib/articles";
import { siteConfig } from "../config/site";

export const Route = createFileRoute("/tags/$tag")({
  head: ({ params }) => {
    const tag = decodeURIComponent(params.tag);
    const encodedTag = encodeURIComponent(tag);

    const title = `#${tag} | ${siteConfig.name}`;
    const description = `#${tag} の記事一覧です。`;
    const url = `${siteConfig.url}/tags/${encodedTag}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },

        { property: "og:site_name", content: siteConfig.name },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: `${siteConfig.url}/ogp.png` },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${siteConfig.url}/ogp.png` },
      ],
      links: [
        {
          rel: "canonical",
          href: url,
        },
      ],
    };
  },
  component: TagPage,
});

function TagPage() {
  const { tag } = Route.useParams();
  const decodedTag = decodeURIComponent(tag);

  const articles = getArticlesByTag(decodedTag);
  const allTags = getAllTags();

  const exists = allTags.some((tag) => tag.name === decodedTag);

  if (!exists) {
    throw notFound();
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
          <p className="text-sm font-medium text-[var(--muted)]">
            Tag Archive
          </p>

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
        <div className="space-y-3 border-t border-[var(--border)] pt-6">
          {articles.map((article) => (
            <ArticleListItem key={article.slug} article={article} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

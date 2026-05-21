import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ArticleThumb } from "../components/ui/ArticleThumb";
import { getArticlesByTag } from "../lib/articles";

export const Route = createFileRoute("/tags/$tag")({
  component: TagPage,
});

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

function TagPage() {
  const { tag } = Route.useParams();
  const decodedTag = decodeURIComponent(tag);
  const articles = getArticlesByTag(decodedTag);

  return (
    <main className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
          >
            ← Home
          </Link>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--text)]">
            # {decodedTag}
          </h1>

          <p className="mt-3 text-sm text-[var(--muted)]">
            {articles.length} articles
          </p>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to="/articles/$slug"
              params={{ slug: article.slug }}
              className="group flex items-center gap-5 bg-transparent px-5 py-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45"
            >
              <ArticleThumb
                src={article.thumbnail}
                title={article.title}
                className="h-24 w-40 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <time className="text-xs text-[var(--muted)]">
                  {formatDate(article.date)}
                </time>

                <h2 className="mt-1 text-lg font-semibold text-[var(--text)] transition group-hover:text-[var(--accent-strong)]">
                  {article.title}
                </h2>

                {article.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {article.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--border)] bg-white/70 px-3 py-1 text-xs text-[var(--accent-strong)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 text-sm font-semibold text-[var(--text)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-strong)]">
                読む →
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <Footer />
      </div>
    </main>
  );
}

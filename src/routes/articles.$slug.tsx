import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug } from "../lib/articles";

export const Route = createFileRoute("/articles/$slug")({
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

  return (
    <main className="min-h-screen px-6 py-10">
      <article className="mx-auto max-w-3xl">
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
                <Link
                  key={tag}
                  to="/tags/$tag"
                  params={{ tag }}
                  className="border border-[var(--border)] bg-white/70 px-3 py-1 text-sm text-[var(--accent-strong)] transition hover:bg-[var(--blue-50)]/70"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div className="prose prose-slate mt-12 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.body}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}

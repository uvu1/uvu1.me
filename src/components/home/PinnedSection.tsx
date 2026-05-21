import type { Article } from "../../lib/articles";
import { ArticleThumb } from "../ui/ArticleThumb";

type PinnedSectionProps = {
  articles: Article[];
};

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

export function PinnedSection({ articles }: PinnedSectionProps) {
  return (
    <section>
      <h2 className="mb-5 text-xl font-bold tracking-wide text-[var(--accent-strong)]">
        # Pinned
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(127,183,232,0.08)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
          >
            <ArticleThumb
              src={article.thumbnail}
              title={article.title}
              className="h-16 w-28 shrink-0"
            />

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[var(--text)]">
                {article.title}
              </h3>

              <p className="mt-1 text-xs text-[var(--muted)]">
                {formatDate(article.date)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

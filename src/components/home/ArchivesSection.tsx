import { Link } from "@tanstack/react-router";
import type { Article } from "../../lib/articles";
import { ArticleThumb } from "../ui/ArticleThumb";

type ArchivesSectionProps = {
  articles: Article[];
};

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

function toTime(date: string) {
  return new Date(date.replaceAll("/", "-")).getTime();
}

export function ArchivesSection({ articles }: ArchivesSectionProps) {
  const sortedArticles = [...articles].sort(
    (a, b) => toTime(b.date) - toTime(a.date),
  );

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold tracking-wide text-[var(--text)]">
        # Archives
      </h2>

      <div className="relative space-y-3">
        <div className="absolute left-2 top-6 bottom-6 w-px bg-[var(--accent-strong)]/35" />

        {sortedArticles.map((article, index) => {
          const isLatest = index === 0;

          return (
            <div
              key={article.slug}
              className="grid grid-cols-[8.5rem_1fr] items-start gap-5"
            >
              <div className="relative z-10 flex items-start gap-4 pt-5">
                <span
                  className={[
                    "mt-1 size-4 shrink-0 rounded-full border-2 border-[var(--accent-strong)]",
                    isLatest
                      ? "bg-[var(--accent-strong)]"
                      : "bg-[var(--surface)]",
                  ].join(" ")}
                />

                <time className="text-sm font-semibold text-[var(--text)]">
                  {formatDate(article.date)}
                </time>
              </div>

              <Link
                to="/articles/$slug"
                params={{ slug: article.slug }}
                className="group flex items-center gap-5 border-0 bg-transparent px-5 py-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45"
              >
                <ArticleThumb
                  src={article.thumbnail}
                  title={article.title}
                  className="h-24 w-40 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text)] transition duration-200 group-hover:text-[var(--accent-strong)]">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                      {article.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-[var(--border)] bg-white/70 px-3 py-1 text-xs text-[var(--accent-strong)] transition duration-200 group-hover:bg-white/90"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-sm font-semibold text-[var(--text)] transition duration-200 group-hover:translate-x-1 group-hover:text-[var(--accent-strong)]">
                  続きを読む →
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import type { Article } from "../../lib/articles";
import { ArticleListItem } from "../article/ArticleListItem";

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

              <ArticleListItem article={article} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

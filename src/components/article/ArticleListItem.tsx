import { Link } from "@tanstack/react-router";
import type { Article } from "../../lib/articles";
import { ArticleThumb } from "../ui/ArticleThumb";
import { TagPill } from "../ui/TagPill";

type ArticleListItemProps = {
  article: Article;
  compact?: boolean;
  showDate?: boolean;
};

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

export function ArticleListItem({
  article,
  compact = false,
  showDate = true,
}: ArticleListItemProps) {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="group flex items-center gap-5 bg-transparent px-5 py-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45"
    >
      <ArticleThumb
        src={article.thumbnail}
        title={article.title}
        className={compact ? "h-16 w-28 shrink-0" : "h-24 w-40 shrink-0"}
      />

      <div className="min-w-0 flex-1">
        {showDate && ( 
          <time className="text-xs text-[var(--muted)]">
            {formatDate(article.date)}
          </time> 
        )}

        <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-[var(--text)] transition group-hover:text-[var(--accent-strong)]">
          {article.title}
        </h3>

        {!compact && article.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {article.description}
          </p>
        )}

        {!compact && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <TagPill key={tag} name={tag} size="sm" />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 text-sm font-semibold text-[var(--text)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-strong)]">
        続きを読む →
      </div>
    </Link>
  );
}

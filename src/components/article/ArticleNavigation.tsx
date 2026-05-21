import { Link } from "@tanstack/react-router";
import type { Article } from "../../lib/articles";

type ArticleNavigationProps = {
  newerArticle?: Article;
  olderArticle?: Article;
};

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

function NavCard({
  label,
  direction,
  article,
}: {
  label: string;
  direction: "prev" | "next";
  article?: Article;
}) {
  if (!article) {
    return (
      <div className="border border-[var(--border)] bg-white/35 px-5 py-4 opacity-45">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">記事がありません</p>
      </div>
    );
  }

  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="group block border border-transparent bg-transparent px-5 py-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45"
    >
      <p className="text-xs font-medium text-[var(--accent-strong)]">
        {direction === "prev" ? "← " : ""}
        {label}
        {direction === "next" ? " →" : ""}
      </p>

      <h3 className="mt-2 line-clamp-1 text-base font-semibold text-[var(--text)] transition group-hover:text-[var(--accent-strong)]">
        {article.title}
      </h3>

      <time className="mt-1 block text-xs text-[var(--muted)]">
        {formatDate(article.date)}
      </time>
    </Link>
  );
}

export function ArticleNavigation({
  newerArticle,
  olderArticle,
}: ArticleNavigationProps) {
  return (
    <nav className="mt-16 border-t border-[var(--border)] pt-8">
      <div className="grid gap-4 md:grid-cols-2">
        <NavCard
          label="前の記事"
          direction="prev"
          article={olderArticle}
        />

        <NavCard
          label="次の記事"
          direction="next"
          article={newerArticle}
        />
      </div>
    </nav>
  );
}

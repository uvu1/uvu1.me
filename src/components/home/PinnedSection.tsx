import { Link } from '@tanstack/react-router'
import type { Article } from '../../lib/articles'
import { ArticleThumb } from '../ui/ArticleThumb'
import { SectionTitle } from '../ui/SectionTitle'
import { formatDate } from '../../lib/date'

type PinnedSectionProps = {
  articles: Article[]
}

export function PinnedSection({ articles }: PinnedSectionProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section>
      <SectionTitle>Pinned</SectionTitle>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to="/articles/$slug"
            params={{ slug: article.slug }}
            className="group flex items-center gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-bg)]/70 px-4 py-3 shadow-[0_10px_30px_rgba(127,183,232,0.08)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--blue-50)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45"
          >
            <ArticleThumb
              src={article.thumbnail}
              title={article.title}
              className="h-16 w-28 shrink-0"
            />

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[var(--text)] transition group-hover:text-[var(--accent-strong)]">
                {article.title}
              </h3>

              <p className="mt-1 text-xs text-[var(--muted)]">
                {formatDate(article.date)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

import { Link } from '@tanstack/react-router'
import type { Article } from '../../lib/articles'
import { ArticleThumb } from '../ui/ArticleThumb'
import { TagPill } from '../ui/TagPill'
import { formatDate } from '../../lib/date'

type ArticleListItemProps = {
  article: Article
  compact?: boolean
  showDate?: boolean
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
      className="group grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-3 bg-transparent px-2 py-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 @2xl:grid-cols-[10rem_minmax(0,1fr)_auto] @2xl:gap-5 @2xl:px-5"
    >
      <ArticleThumb
        src={article.thumbnail}
        title={article.title}
        className={[
          'h-16 w-full',
          compact ? '@2xl:h-16 @2xl:w-28' : '@2xl:h-24',
        ].join(' ')}
      />

      <div className="min-w-0">
        {showDate && (
          <time className="text-xs text-[var(--muted)]">
            {formatDate(article.date)}
          </time>
        )}

        <h3
          className={[
            'line-clamp-2 text-sm font-semibold text-[var(--text)] transition group-hover:text-[var(--accent-strong)] @2xl:line-clamp-1 @2xl:text-lg',
            showDate ? 'mt-1' : '',
          ].join(' ')}
        >
          {article.title}
        </h3>

        {!compact && article.description && (
          <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-[var(--muted)] @2xl:block">
            {article.description}
          </p>
        )}

        {!compact && article.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 @2xl:mt-3 @2xl:gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag} name={tag} size="sm" />
            ))}
          </div>
        )}
      </div>

      <div className="hidden shrink-0 text-sm font-semibold text-[var(--text)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-strong)] @2xl:block">
        続きを読む →
      </div>
    </Link>
  )
}

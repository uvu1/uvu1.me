import { ArticleListItem } from '../article/ArticleListItem'
import { SectionTitle } from '../ui/SectionTitle'
import type { Article } from '../../lib/articles'
import { formatDate } from '../../lib/date'

type ArchivesSectionProps = {
  articles: Article[]
}

export function ArchivesSection({ articles }: ArchivesSectionProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section>
      <SectionTitle>Archives</SectionTitle>

      <div className="relative mt-8">
        <div className="absolute left-[0.45rem] top-3 bottom-3 w-px bg-[var(--accent-strong)]/35 sm:left-[0.55rem]" />

        <div className="space-y-7">
          {articles.map((article, index) => {
            const isLatest = index === 0

            return (
              <div
                key={article.slug}
                className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-5"
              >
                <div className="relative z-10 flex items-start gap-3 pt-2 sm:gap-4 sm:pt-5">
                  <span
                    className={[
                      'mt-1 size-4 shrink-0 rounded-full border-2 border-[var(--accent-strong)]',
                      isLatest
                        ? 'bg-[var(--accent-strong)]'
                        : 'bg-[var(--surface)]',
                    ].join(' ')}
                  />

                  <time className="hidden text-sm font-semibold text-[var(--text)] sm:block">
                    {formatDate(article.date)}
                  </time>
                </div>

                <div className="min-w-0">
                  <time className="mb-2 block text-sm font-semibold text-[var(--text)] sm:hidden">
                    {formatDate(article.date)}
                  </time>

                  <ArticleListItem article={article} showDate={false} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

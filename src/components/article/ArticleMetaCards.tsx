import { FiCalendar, FiClock } from "react-icons/fi";
import { formatDate } from "../../lib/date";

type ArticleMetaCardsProps = {
  date: string;
  readingTime: number;
};

export function ArticleMetaCards({
  date,
  readingTime,
}: ArticleMetaCardsProps) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent-strong)]/25 bg-[var(--card-bg)]/55 px-4 py-3 shadow-[0_10px_30px_rgba(127,183,232,0.08)] backdrop-blur">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
          <FiCalendar className="size-4" />
        </span>

        <div>
          <p className="text-xs font-medium text-[var(--muted)]">投稿日</p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--text)]">
            {formatDate(date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent-strong)]/25 bg-[var(--card-bg)]/55 px-4 py-3 shadow-[0_10px_30px_rgba(127,183,232,0.08)] backdrop-blur">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
          <FiClock className="size-4" />
        </span>

        <div>
          <p className="text-xs font-medium text-[var(--muted)]">読み終わるまで</p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--text)]">
            {readingTime} min
          </p>
        </div>
      </div>
    </div>
  );
}

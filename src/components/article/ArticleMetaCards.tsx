type ArticleMetaCardsProps = {
  date: string;
  readingTime: number;
};

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

export function ArticleMetaCards({
  date,
  readingTime,
}: ArticleMetaCardsProps) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent-strong)]/25 bg-white/55 px-4 py-3 shadow-[0_10px_30px_rgba(127,183,232,0.08)] backdrop-blur">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
          <CalendarIcon />
        </span>

        <div>
          <p className="text-xs font-medium text-[var(--muted)]">投稿日</p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--text)]">
            {formatDate(date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent-strong)]/25 bg-white/55 px-4 py-3 shadow-[0_10px_30px_rgba(127,183,232,0.08)] backdrop-blur">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
          <ClockIcon />
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

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 9h18" />
      <path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

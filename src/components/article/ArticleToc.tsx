import type { TocItem } from "../../generated/articles";

type ArticleTocProps = {
  toc: TocItem[];
};

export function ArticleToc({ toc }: ArticleTocProps) {
  if (toc.length === 0) {
    return null;
  }

  return (
    <details
      open
      className="group sticky top-8 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-[var(--border)] pl-5"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <TocIcon />

          <p className="truncate bg-gradient-to-r from-[#7FB7E8] via-[#A7BDF4] to-[#F2B8D8] bg-clip-text text-sm font-bold tracking-wide text-transparent">
            Table of Contents
          </p>
        </div>

        <span
          aria-hidden="true"
          className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--accent-strong)]/35 bg-white/70 text-sm font-bold leading-none text-[var(--accent-strong)] transition duration-200 group-hover:border-[var(--accent-strong)] group-hover:bg-[var(--blue-50)]/70"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:block">−</span>
        </span>
      </summary>

      <div className="mt-4">
        <nav className="space-y-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block text-sm font-medium leading-6 text-[var(--text)] transition hover:text-[var(--accent-strong)]"
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </details>
  );
}

function TocIcon() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--accent-strong)]/35 bg-white/45 text-[var(--accent-strong)]">
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
        <path d="M8 6h11" />
        <path d="M8 12h11" />
        <path d="M8 18h11" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </svg>
    </span>
  );
}

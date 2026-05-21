"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../../generated/articles";

type ArticleTocProps = {
  toc: TocItem[];
};

export function ArticleToc({ toc }: ArticleTocProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "");

  useEffect(() => {
    if (toc.length === 0) return;

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const updateActiveHeading = () => {
      const current = [...headings]
        .reverse()
        .find((heading) => heading.getBoundingClientRect().top <= 140);

      if (current) {
        setActiveId(current.id);
      } else {
        setActiveId(headings[0]?.id ?? "");
      }
    };

    const observer = new IntersectionObserver(
      () => {
        updateActiveHeading();
      },
      {
        root: null,
        rootMargin: "-120px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    updateActiveHeading();

    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [toc]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-8 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-[var(--border)] pl-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <TocIcon />

          <p className="truncate bg-gradient-to-r from-[#7FB7E8] via-[#A7BDF4] to-[#F2B8D8] bg-clip-text text-sm font-bold tracking-wide text-transparent">
            Table of Contents
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "目次を折りたたむ" : "目次を開く"}
          aria-expanded={isOpen}
          className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--accent-strong)]/35 bg-white/70 text-sm font-bold leading-none text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
        >
          <span
            className={[
              "block transition duration-300 ease-out",
              isOpen ? "rotate-0 scale-100" : "rotate-90 scale-110",
            ].join(" ")}
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </div>

      <div
        className={[
          "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
          isOpen
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <nav className="min-h-0 overflow-hidden space-y-1.5">
          {toc.map((item) => {
            const isActive = item.id === activeId;

            return (
              <a
                key={item.id}
                href={`#${encodeURIComponent(item.id)}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveId(item.id)}
                className={[
                  "block border-l-2 px-3 py-1.5 text-sm leading-6 transition duration-200",
                  isActive
                    ? "border-[var(--accent-strong)] bg-[var(--blue-50)]/70 font-semibold text-[var(--accent-strong)]"
                    : "border-transparent text-[var(--text)] hover:border-[var(--accent-strong)]/45 hover:bg-white/45 hover:text-[var(--accent-strong)]",
                ].join(" ")}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
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

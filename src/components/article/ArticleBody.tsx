"use client";

import { useEffect, useRef } from "react";

type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const body = bodyRef.current;

    if (!body) return;

    async function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const heading = target.closest("h1, h2, h3");

      if (!(heading instanceof HTMLHeadingElement)) return;
      if (!body?.contains(heading)) return;
      if (!heading.id) return;

      const url = new URL(window.location.href);
      url.hash = heading.id;

      try {
        await navigator.clipboard.writeText(url.toString());

        heading.dataset.copied = "true";

        window.setTimeout(() => {
          delete heading.dataset.copied;
        }, 1200);
      } catch {
        window.location.hash = heading.id;
      }
    }

    body.addEventListener("click", handleClick);

    return () => {
      body.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={bodyRef}
      className="article-body mt-10 min-w-0 overflow-hidden text-[var(--text)] sm:mt-12"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

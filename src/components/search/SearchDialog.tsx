"use client";

import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { getArchiveArticles } from "../../lib/articles";
import type { Article } from "../../lib/articles";
import { TagPill } from "../ui/TagPill";
import { escapeRegExp, searchArticles, normalizeText, parseQuery, } from "../../lib/search";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatDate(date: string) {
  return date.replaceAll("-", "/");
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const { words } = parseQuery(query);

  if (words.length === 0) {
    return <>{text}</>;
  }

  const pattern = words.map(escapeRegExp).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = words.some(
          (word) => normalizeText(part) === normalizeText(word),
        );

        if (!isMatch) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <mark
            key={`${part}-${index}`}
            className="rounded-full bg-[#FCECF4]/80 px-1 text-[var(--accent-strong)]"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const articles = getArchiveArticles();
  const parsedQuery = useMemo(() => parseQuery(query), [query]);
  const hasQuery =
    parsedQuery.words.length > 0 || parsedQuery.tagFilters.length > 0;

  const results = useMemo(() => {
    return searchArticles(articles, query).slice(0, 10);
  }, [articles, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const current = resultRefs.current[activeIndex];

    current?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (results.length === 0) return 0;
          return (current + 1) % results.length;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (results.length === 0) return 0;
          return (current - 1 + results.length) % results.length;
        });
        return;
      }

      if (event.key === "Enter") {
        const selected = results[activeIndex];

        if (!selected) return;

        event.preventDefault();
        onOpenChange(false);

        router.navigate({
          to: "/articles/$slug",
          params: {
            slug: selected.article.slug,
          },
        });
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, onOpenChange, open, results, router]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        type="button"
        aria-label="検索を閉じる"
        className="absolute inset-0 bg-[#101827]/20 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="absolute left-1/2 top-24 w-[min(calc(100vw-2rem),46rem)] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/85 shadow-[0_24px_90px_rgba(127,183,232,0.28)] backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <FiSearch className="size-5 shrink-0 text-[var(--accent-strong)]" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='検索'
            className="min-w-0 flex-1 bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="検索をクリア"
              className="grid size-8 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--blue-50)]/70 hover:text-[var(--accent-strong)]"
            >
              <FiX className="size-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="hidden rounded-full border border-[var(--accent-strong)]/25 bg-[var(--card-bg)]/60 px-3 py-1 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--blue-50)]/70 hover:text-[var(--accent-strong)] sm:block"
          >
            ESC
          </button>
        </div>

        {parsedQuery.tagFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-5 py-3">
            <span className="text-xs font-semibold text-[var(--muted)]">
              filters:
            </span>

            {parsedQuery.tagFilters.map((tag) => (
              <TagPill key={tag} name={tag} size="sm" />
            ))}
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!hasQuery ? (
            <SearchEmptyState />
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <SearchResultItem
                  key={result.article.slug}
                  article={result.article}
                  query={query}
                  active={index === activeIndex}
                  refCallback={(element) => {
                    resultRefs.current[index] = element;
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onSelect={() => onOpenChange(false)}
                />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[var(--text)]">
                No articles found
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                別のキーワードで検索してみてください。
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--muted)]">
          <p>
            {hasQuery ? (
              <>
                <span className="font-semibold text-[var(--accent-strong)]">
                  {results.length}
                </span>{" "}
                results
              </>
            ) : (
              "Type keyword to search"
            )}
          </p>

          <div className="hidden items-center gap-3 sm:flex">
            <span>↑↓ move</span>
            <span>Enter open</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchEmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full border border-[var(--accent-strong)]/25 bg-[var(--card-bg)]/60 text-[var(--accent-strong)] shadow-[0_12px_36px_rgba(127,183,232,0.12)]">
        <FiSearch className="size-6" />
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--text)]">
        キーワードを入力して検索
      </p>

      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
        タイトル・説明・タグ・本文から記事を検索できます。
        <br />
        タグで絞り込むときは{" "}
        <code className="rounded-full bg-[var(--blue-50)] px-2 py-0.5 text-[var(--accent-strong)]">
          {"{tag: UI}"}
        </code>{" "}
        のように入力します。
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <ExampleQuery query="Markdown" />
        <ExampleQuery query="{tag: UI}" />
        <ExampleQuery query="TanStack {tag: Web}" />
      </div>
    </div>
  );
}

function ExampleQuery({ query }: { query: string }) {
  return (
    <span className="rounded-full border border-[var(--accent-strong)]/20 bg-[var(--card-bg)]/55 px-3 py-1 text-xs font-semibold text-[var(--muted)]">
      {query}
    </span>
  );
}

function SearchResultItem({
  article,
  query,
  active,
  refCallback,
  onMouseEnter,
  onSelect,
}: {
  article: Article;
  query: string;
  active: boolean;
  refCallback: (element: HTMLAnchorElement | null) => void;
  onMouseEnter: () => void;
  onSelect: () => void;
}) {
  return (
    <Link
      ref={refCallback}
      to="/articles/$slug"
      params={{ slug: article.slug }}
      onMouseEnter={onMouseEnter}
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={[
        "group block rounded-[1.25rem] px-4 py-3 transition duration-200",
        active
          ? "bg-[var(--blue-50)]/80 shadow-[0_10px_30px_rgba(127,183,232,0.14)]"
          : "hover:bg-[var(--blue-50)]/60",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--muted)]">
            {formatDate(article.date)}
          </p>

          <h3
            className={[
              "mt-1 line-clamp-1 text-base font-bold transition",
              active
                ? "text-[var(--accent-strong)]"
                : "text-[var(--text)] group-hover:text-[var(--accent-strong)]",
            ].join(" ")}
          >
            <HighlightText text={article.title} query={query} />
          </h3>

          {article.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
              <HighlightText text={article.description} query={query} />
            </p>
          )}

          {article.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.slice(0, 4).map((tag) => (
                <TagPill key={tag} name={tag} size="sm" />
              ))}
            </div>
          )}
        </div>

        <span
          className={[
            "mt-1 shrink-0 text-sm font-bold text-[var(--accent-strong)] transition",
            active
              ? "translate-x-1 opacity-100"
              : "opacity-0 group-hover:translate-x-1 group-hover:opacity-100",
          ].join(" ")}
        >
          →
        </span>
      </div>
    </Link>
  );
}

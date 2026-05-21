"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiMenu, FiRss, FiSearch, FiX } from "react-icons/fi";
import { SearchDialog } from "../search/SearchDialog";
import { RssCopyPopover } from "./RssCopyPopover";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/articles" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
] as const;

const rssUrl = "https://uvu1.me/rss.xml";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rssPopoverOpen, setRssPopoverOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function copyRssUrl() {
    try {
      await navigator.clipboard.writeText(rssUrl);
    } finally {
      setRssPopoverOpen(true);
      setMenuOpen(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="relative z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="bg-gradient-to-r from-[#6FA8DC] via-[#9DB9F2] to-[#E8B7D8] bg-clip-text text-base font-bold tracking-[0.1em] text-transparent drop-shadow-[0_4px_16px_rgba(127,183,232,0.24)] transition hover:opacity-70 sm:text-xl"
          >
            uvu1.me
          </Link>

          <div className="flex items-center gap-8 md:gap-10">
            <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--text)] md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition hover:text-[var(--accent-strong)]"
                  activeProps={{
                    className: "text-[var(--accent-strong)]",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyRssUrl}
                aria-label="RSSリンクをコピー"
                className="hidden size-9 place-items-center rounded-full border border-[var(--accent-strong)]/25 bg-white/55 text-[var(--accent-strong)] shadow-[0_8px_24px_rgba(127,183,232,0.08)] backdrop-blur transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70 md:grid"
              >
                <FiRss className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="検索を開く"
                className="grid size-9 place-items-center rounded-full border border-[var(--accent-strong)]/25 bg-white/55 text-[var(--accent-strong)] shadow-[0_8px_24px_rgba(127,183,232,0.08)] backdrop-blur transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70 md:size-auto md:flex md:gap-2 md:px-3 md:py-2 md:text-xs md:font-semibold md:text-[var(--muted)] md:hover:text-[var(--accent-strong)]"
              >
                <FiSearch className="size-4" />
                <span className="hidden md:inline">Search</span>
                <kbd className="ml-1 hidden rounded-full bg-white/70 px-2 py-0.5 text-[0.65rem] text-[var(--muted)] lg:inline">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
                aria-expanded={menuOpen}
                className="grid size-9 place-items-center rounded-full border border-[var(--accent-strong)]/25 bg-white/55 text-[var(--accent-strong)] shadow-[0_8px_24px_rgba(127,183,232,0.08)] backdrop-blur transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70 md:hidden"
              >
                {menuOpen ? (
                  <FiX className="size-4" />
                ) : (
                  <FiMenu className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <MobileMenu
          open={menuOpen}
          onClose={closeMenu}
          onRssClick={copyRssUrl}
        />
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <RssCopyPopover
        open={rssPopoverOpen}
        onOpenChange={setRssPopoverOpen}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  onRssClick,
}: {
  open: boolean;
  onClose: () => void;
  onRssClick: () => void;
}) {
  return (
    <div
      className={[
        "md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label="メニューを閉じる"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-[#101827]/10 backdrop-blur-[2px] transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div
        className={[
          "fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(127,183,232,0.26)] backdrop-blur-2xl transition duration-200",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        ].join(" ")}
      >
        <nav className="p-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--blue-50)]/70 hover:text-[var(--accent-strong)]"
              activeProps={{
                className: "text-[var(--accent-strong)] bg-[var(--blue-50)]/55",
              }}
            >
              <span>{item.label}</span>
              <span className="text-[var(--accent-strong)]">→</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={onRssClick}
            className="mt-2 flex w-full items-center justify-between rounded-[1.25rem] border border-[var(--accent-strong)]/20 bg-white/55 px-4 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--blue-50)]/70 hover:text-[var(--accent-strong)]"
          >
            <span className="flex items-center gap-2">
              <FiRss className="size-4 text-[var(--accent-strong)]" />
              RSS Feed
            </span>

            <span className="text-xs font-semibold text-[var(--muted)]">
              Copy
            </span>
          </button>
        </nav>

        <div className="border-t border-[var(--border)] px-5 py-4">
          <p className="text-xs leading-6 text-[var(--muted)]">
            RSSを登録すると、最新記事を好きなリーダーで確認できます。
          </p>
        </div>
      </div>
    </div>
  );
}

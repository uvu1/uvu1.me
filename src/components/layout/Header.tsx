"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiRss, FiSearch } from "react-icons/fi";
import { RssCopyPopover } from "./RssCopyPopover";
import { SearchDialog } from "../search/SearchDialog";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/articles" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
] as const;

const rssUrl = "https://uvu1.me/rss.xml";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [rssPopoverOpen, setRssPopoverOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!isSearchShortcut) return;

      event.preventDefault();
      setSearchOpen(true);
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function copyRssUrl() {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setRssPopoverOpen(true);
    } catch {
      setRssPopoverOpen(true);
    }
  }

  return (
    <>
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            to="/"
            className="bg-gradient-to-r from-[#6FA8DC] via-[#9DB9F2] to-[#E8B7D8] bg-clip-text text-xl font-bold tracking-[0.1em] text-transparent drop-shadow-[0_4px_16px_rgba(127,183,232,0.24)] transition hover:opacity-70"
          >
            uvu1.me
          </Link>

          <nav className="flex items-center gap-8 text-sm font-medium text-[var(--text)]">
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyRssUrl}
                aria-label="RSSリンクをコピー"
                className="grid size-9 place-items-center rounded-full border border-[var(--accent-strong)]/25 bg-white/55 text-[var(--accent-strong)] shadow-[0_8px_24px_rgba(127,183,232,0.08)] backdrop-blur transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
              >
                <FiRss className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-full border border-[var(--accent-strong)]/25 bg-white/55 px-3 py-2 text-xs font-semibold text-[var(--muted)] shadow-[0_8px_24px_rgba(127,183,232,0.08)] backdrop-blur transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70 hover:text-[var(--accent-strong)]"
              >
                <FiSearch className="size-4" />
                <span>Search</span>
                <kbd className="ml-1 hidden rounded-full bg-white/70 px-2 py-0.5 text-[0.65rem] text-[var(--muted)] md:inline">
                  ⌘K
                </kbd>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <RssCopyPopover
        open={rssPopoverOpen}
        onOpenChange={setRssPopoverOpen}
      />
    </>
  );
}

"use client";

import { useEffect } from "react";
import { FiCheck, FiRss, FiX } from "react-icons/fi";

type RssCopyPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RssCopyPopover({
  open,
  onOpenChange,
}: RssCopyPopoverProps) {
  useEffect(() => {
    if (!open) return;

    const timeout = window.setTimeout(() => {
      onOpenChange(false);
    }, 3600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed right-6 top-24 z-[1000] w-[min(calc(100vw-2rem),24rem)]">
      <div className="rounded-[1.5rem] border border-white/70 bg-[var(--card-bg)]/90 p-5 shadow-[0_24px_80px_rgba(127,183,232,0.28)] backdrop-blur-2xl">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
            <FiCheck className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FiRss className="size-4 text-[var(--accent-strong)]" />
              <p className="text-sm font-bold text-[var(--text)]">
                RSSリンクをコピーしました
              </p>
            </div>

            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              お好みのRSSリーダーに登録すると、uvu1.me の最新記事を簡単に確認できます。
            </p>

            <p className="mt-3 truncate rounded-full border border-[var(--accent-strong)]/20 bg-[var(--card-bg)]/65 px-3 py-1.5 font-mono text-xs text-[var(--accent-strong)]">
              https://uvu1.me/rss.xml
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="閉じる"
            className="grid size-8 shrink-0 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--blue-50)]/70 hover:text-[var(--accent-strong)]"
          >
            <FiX className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

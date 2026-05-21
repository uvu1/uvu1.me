"use client";

import { FiHeart, FiLink } from "react-icons/fi";
import { ArticleShareButtons } from "./ArticleShareButtons";
import { useArticleActionsContext } from "./useArticleActions";

export function ArticleActionRail() {
  const {
    shareLinks,
    liked,
    likeCount,
    likeLoading,
    copied,
    toggleLike,
    copyUrl,
  } = useArticleActionsContext();

  return (
    <aside className="fixed left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] top-49 z-40 hidden h-fit flex-col items-center gap-3 xl:flex">
      <button
        type="button"
        onClick={toggleLike}
        disabled={likeLoading}
        aria-pressed={liked}
        aria-label="この記事にいいねする"
        className={[
          "grid size-11 place-items-center rounded-full border transition duration-200 disabled:cursor-wait disabled:opacity-70",
          liked
            ? "border-[#F2B8D8]/70 bg-[#FCECF4]/80 text-[#D978A6]"
            : "border-[var(--accent-strong)]/30 bg-[var(--card-bg)]/55 text-[var(--accent-strong)] hover:border-[#F2B8D8]/70 hover:bg-[#FCECF4]/70 hover:text-[#D978A6]",
        ].join(" ")}
      >
        <FiHeart className={liked ? "size-5 fill-current" : "size-5"} />
      </button>

      <span className="text-xs font-semibold text-[var(--muted)]">
        {likeLoading ? "…" : likeCount}
      </span>

      <Divider />

      <ArticleShareButtons links={shareLinks} variant="rail" />

      <button
        type="button"
        onClick={copyUrl}
        aria-label="URLをコピー"
        className="grid size-11 place-items-center rounded-full border border-[var(--accent-strong)]/30 bg-[var(--card-bg)]/55 text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
      >
        {copied ? (
          <span className="text-[0.65rem] font-bold">OK</span>
        ) : (
          <FiLink className="size-4" />
        )}
      </button>
    </aside>
  );
}

function Divider() {
  return <div className="my-1 h-px w-8 bg-[var(--border)]" />;
}

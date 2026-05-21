"use client";

import { FiHeart, FiLink } from "react-icons/fi";
import { ArticleShareButtons } from "./ArticleShareButtons";
import { useArticleActionsContext } from "./useArticleActions";

export function ArticleMobileActions() {
  const { shareLinks, liked, likeLoading, copied, toggleLike, copyUrl } =
    useArticleActionsContext();

  return (
    <section className="mt-10 xl:hidden">
      <div className="flex items-center justify-center gap-2 rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={toggleLike}
          disabled={likeLoading}
          aria-pressed={liked}
          aria-label="この記事にいいねする"
          className={[
            "grid size-10 place-items-center rounded-full border transition disabled:cursor-wait disabled:opacity-70",
            liked
              ? "border-[#F2B8D8]/70 bg-[#FCECF4]/30 text-[#D978A6]"
              : "border-[var(--accent-strong)]/30 text-[var(--accent-strong)] hover:bg-[var(--blue-50)]",
          ].join(" ")}
        >
          <FiHeart className={liked ? "size-4 fill-current" : "size-4"} />
        </button>

        <ArticleShareButtons links={shareLinks} variant="mobile" />

        <button
          type="button"
          onClick={copyUrl}
          aria-label="URLをコピー"
          className="grid size-10 place-items-center rounded-full border border-[var(--accent-strong)]/30 text-[var(--accent-strong)] transition hover:bg-[var(--blue-50)]"
        >
          {copied ? (
            <span className="text-[0.65rem] font-bold">OK</span>
          ) : (
            <FiLink className="size-4" />
          )}
        </button>
      </div>
    </section>
  );
}

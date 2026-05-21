"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";
import { SiHatenabookmark, SiMisskey } from "react-icons/si";
import { getClientId } from "../../lib/client-id";

type ArticleActionRailProps = {
  slug: string;
  title: string;
};

type LikeState = {
  slug: string;
  count: number;
  liked: boolean;
};

const MISSKEY_INSTANCE = "misskey.io";

export function ArticleActionRail({ slug, title }: ArticleActionRailProps) {
  const [url, setUrl] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLikeState() {
      try {
        setLikeLoading(true);

        const response = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
          headers: {
            "x-uvu-client-id": getClientId(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load likes");
        }

        const data = (await response.json()) as LikeState;

        if (cancelled) return;

        setLiked(data.liked);
        setLikeCount(data.count);
      } catch {
        if (cancelled) return;

        setLiked(false);
        setLikeCount(0);
      } finally {
        if (!cancelled) {
          setLikeLoading(false);
        }
      }
    }

    loadLikeState();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(`${title}\n${url}`);

    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      misskey: `https://${MISSKEY_INSTANCE}/share?text=${encodedText}`,
      hatena: `https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}&title=${encodedTitle}`,
    };
  }, [title, url]);

  async function toggleLike() {
    if (likeLoading) return;

    const nextLiked = !liked;
    const previousLiked = liked;
    const previousCount = likeCount;

    setLiked(nextLiked);
    setLikeCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    setLikeLoading(true);

    try {
      const response = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-uvu-client-id": getClientId(),
        },
        body: JSON.stringify({
          liked: nextLiked,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const data = (await response.json()) as LikeState;

      setLiked(data.liked);
      setLikeCount(data.count);
    } catch {
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setLikeLoading(false);
    }
  }

  async function copyUrl() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="fixed left-[max(4rem,calc((100vw-96rem)/2+5.75rem))] top-[10.25rem] z-40 hidden h-fit flex-col items-center gap-3 lg:flex">
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
            : "border-[var(--accent-strong)]/30 bg-white/55 text-[var(--accent-strong)] hover:border-[#F2B8D8]/70 hover:bg-[#FCECF4]/70 hover:text-[#D978A6]",
        ].join(" ")}
      >
        <HeartIcon filled={liked} />
      </button>

      <span className="text-xs font-semibold text-[var(--muted)]">
        {likeLoading ? "…" : likeCount}
      </span>

      <Divider />

      <ShareLink href={shareLinks.twitter} label="Xで共有">
        X
      </ShareLink>

      <ShareLink href={shareLinks.misskey} label="Misskeyで共有">
        Mk
      </ShareLink>

      <ShareLink href={shareLinks.hatena} label="はてなブックマークで共有">
        B!
      </ShareLink>

      <button
        type="button"
        onClick={copyUrl}
        aria-label="URLをコピー"
        className="grid size-11 place-items-center rounded-full border border-[var(--accent-strong)]/30 bg-white/55 text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
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

function ShareLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid size-11 place-items-center rounded-full border border-[var(--accent-strong)]/30 bg-white/55 text-xs font-bold text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
    >
      {children}
    </a>
  );
}

function Divider() {
  return <div className="my-1 h-px w-8 bg-[var(--border)]" />;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6c-1.8-1.8-4.8-1.8-6.6 0L12 6.8 9.8 4.6c-1.8-1.8-4.8-1.8-6.6 0s-1.8 4.8 0 6.6L12 20l8.8-8.8c1.8-1.8 1.8-4.8 0-6.6Z" />
    </svg>
  );
}

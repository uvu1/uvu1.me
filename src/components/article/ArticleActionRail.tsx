"use client";

import { useEffect, useMemo, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";
import { SiHatenabookmark, SiMisskey } from "react-icons/si";

type ArticleActionRailProps = {
  slug: string;
  title: string;
};

const MISSKEY_INSTANCE = "misskey.io";

export function ArticleActionRail({ slug, title }: ArticleActionRailProps) {
  const [url, setUrl] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const likeKey = `uvu1-like:${slug}`;
  const likeCountKey = `uvu1-like-count:${slug}`;

  useEffect(() => {
    setUrl(window.location.href);

    const storedLiked = window.localStorage.getItem(likeKey) === "true";
    const storedCount = Number(window.localStorage.getItem(likeCountKey) ?? "0");

    setLiked(storedLiked);
    setLikeCount(Number.isNaN(storedCount) ? 0 : storedCount);
  }, [likeKey, likeCountKey]);

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

  function toggleLike() {
    const nextLiked = !liked;
    const nextCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikeCount(nextCount);

    window.localStorage.setItem(likeKey, String(nextLiked));
    window.localStorage.setItem(likeCountKey, String(nextCount));
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
    <aside className="fixed left-[max(1rem,calc((100vw-88rem)/2+4rem))] top-48 z-40 hidden h-fit flex-col items-center gap-3 lg:flex">
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label="この記事にいいねする"
        className={[
          "grid size-11 place-items-center rounded-full border transition duration-200",
          liked
            ? "border-[#F2B8D8]/70 bg-[#FCECF4]/80 text-[#D978A6]"
            : "border-[var(--accent-strong)]/30 bg-white/55 text-[var(--accent-strong)] hover:border-[#F2B8D8]/70 hover:bg-[#FCECF4]/70 hover:text-[#D978A6]",
        ].join(" ")}
      >
        <HeartIcon filled={liked} />
      </button>

      <span className="text-xs font-semibold text-[var(--muted)]">
        {likeCount}
      </span>

      <Divider />

      <ShareLink href={shareLinks.twitter} label="Xで共有">
        <FaXTwitter className="size-4" />
      </ShareLink>

      <ShareLink href={shareLinks.misskey} label="Misskeyで共有">
        <SiMisskey className="size-4" />
      </ShareLink>

      <ShareLink href={shareLinks.hatena} label="はてなブックマークで共有">
        <SiHatenabookmark className="size-4" />
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
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid size-11 place-items-center rounded-full border border-[var(--accent-strong)]/30 bg-white/55 text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
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

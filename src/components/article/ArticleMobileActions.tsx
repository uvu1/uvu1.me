"use client";

import { useEffect, useMemo, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FiHeart, FiLink } from "react-icons/fi";
import { SiHatenabookmark, SiMisskey } from "react-icons/si";
import { getClientId } from "../../lib/client-id";

type ArticleMobileActionsProps = {
  slug: string;
  title: string;
};

type LikeState = {
  slug: string;
  count: number;
  liked: boolean;
};

const MISSKEY_INSTANCE = "misskey.io";

export function ArticleMobileActions({
  slug,
  title,
}: ArticleMobileActionsProps) {
  const [url, setUrl] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, [slug]);

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
      } catch {
        if (cancelled) return;

        setLiked(false);
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

    setLiked(nextLiked);
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
    } catch {
      setLiked(previousLiked);
    } finally {
      setLikeLoading(false);
    }
  }

  async function copyUrl() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

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

        <ShareButton href={shareLinks.twitter} label="Xで共有">
          <FaXTwitter className="size-4" />
        </ShareButton>

        <ShareButton href={shareLinks.misskey} label="Misskeyで共有">
          <SiMisskey className="size-4" />
        </ShareButton>

        <ShareButton href={shareLinks.hatena} label="はてなブックマークで共有">
          <SiHatenabookmark className="size-4" />
        </ShareButton>

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

function ShareButton({
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
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-[var(--accent-strong)]/30 text-[var(--accent-strong)] transition hover:bg-[var(--blue-50)]"
    >
      {children}
    </a>
  );
}

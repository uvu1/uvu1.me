'use client'

import type { ReactNode } from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import { SiHatenabookmark, SiMisskey } from 'react-icons/si'
import type { ArticleShareLinks } from './useArticleActions'

type ArticleShareButtonsProps = {
  links: ArticleShareLinks
  variant: 'rail' | 'mobile'
}

const shareButtonClass = {
  rail: 'grid size-11 place-items-center rounded-full border border-[var(--accent-strong)]/30 bg-[var(--card-bg)]/55 text-xs font-bold text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70',
  mobile:
    'grid size-10 place-items-center rounded-full border border-[var(--accent-strong)]/30 text-[var(--accent-strong)] transition hover:bg-[var(--blue-50)]',
}

export function ArticleShareButtons({
  links,
  variant,
}: ArticleShareButtonsProps) {
  const className = shareButtonClass[variant]

  return (
    <>
      <ShareLink href={links.twitter} label="Xで共有" className={className}>
        <FaXTwitter className="size-4" />
      </ShareLink>

      <ShareLink
        href={links.misskey}
        label="Misskeyで共有"
        className={className}
      >
        <SiMisskey className="size-4" />
      </ShareLink>

      <ShareLink
        href={links.hatena}
        label="はてなブックマークで共有"
        className={className}
      >
        <SiHatenabookmark className="size-4" />
      </ShareLink>
    </>
  )
}

function ShareLink({
  href,
  label,
  className,
  children,
}: {
  href: string
  label: string
  className: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

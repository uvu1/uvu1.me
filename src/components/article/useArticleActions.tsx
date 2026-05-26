'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

type LikeState = {
  slug: string
  count: number
  liked: boolean
}

type UseArticleActionsOptions = {
  slug: string
  title: string
}

export type ArticleShareLinks = {
  twitter: string
  misskey: string
  hatena: string
}

export type ArticleActionsState = {
  shareLinks: ArticleShareLinks
  liked: boolean
  likeCount: number
  likeLoading: boolean
  copied: boolean
  toggleLike: () => Promise<void>
  copyUrl: () => Promise<void>
}

const MISSKEY_INSTANCE = 'misskey.io'
const ArticleActionsContext = createContext<ArticleActionsState | null>(null)

function isLikeState(value: unknown): value is LikeState {
  if (!value || typeof value !== 'object') return false
  return true
}

async function readLikeState(response: Response) {
  const data: unknown = await response.json()
  if (!isLikeState(data)) throw new Error('Invalid like state response')
  return data
}

export function useArticleActions({
  slug,
  title,
}: UseArticleActionsOptions): ArticleActionsState {
  const [url, setUrl] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(window.location.href)
  }, [slug])

  useEffect(() => {
    let cancelled = false

    async function loadLikeState() {
      try {
        setLikeLoading(true)

        const response = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
          credentials: 'same-origin',
        })

        if (!response.ok) {
          throw new Error('Failed to load likes')
        }

        const data = await readLikeState(response)

        if (cancelled) return

        setLiked(data.liked)
        setLikeCount(data.count)
      } catch {
        if (cancelled) return

        setLiked(false)
        setLikeCount(0)
      } finally {
        if (!cancelled) {
          setLikeLoading(false)
        }
      }
    }

    loadLikeState()

    return () => {
      cancelled = true
    }
  }, [slug])

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedText = encodeURIComponent(`${title}\n${url}`)

    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      misskey: `https://${MISSKEY_INSTANCE}/share?text=${encodedText}`,
      hatena: `https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}&title=${encodedTitle}`,
    }
  }, [title, url])

  const toggleLike = useCallback(async () => {
    if (likeLoading) return

    const nextLiked = !liked
    const previousLiked = liked
    const previousCount = likeCount

    setLiked(nextLiked)
    setLikeCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)))
    setLikeLoading(true)

    try {
      const response = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          liked: nextLiked,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      const data = await readLikeState(response)

      setLiked(data.liked)
      setLikeCount(data.count)
    } catch {
      setLiked(previousLiked)
      setLikeCount(previousCount)
    } finally {
      setLikeLoading(false)
    }
  }, [likeCount, likeLoading, liked, slug])

  const copyUrl = useCallback(async () => {
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1200)
    } catch {
      setCopied(false)
    }
  }, [url])

  return useMemo(
    () => ({
      shareLinks,
      liked,
      likeCount,
      likeLoading,
      copied,
      toggleLike,
      copyUrl,
    }),
    [copied, copyUrl, likeCount, likeLoading, liked, shareLinks, toggleLike],
  )
}

export function ArticleActionsProvider({
  slug,
  title,
  children,
}: UseArticleActionsOptions & { children: ReactNode }) {
  const actions = useArticleActions({ slug, title })

  return (
    <ArticleActionsContext.Provider value={actions}>
      {children}
    </ArticleActionsContext.Provider>
  )
}

export function useArticleActionsContext() {
  const actions = useContext(ArticleActionsContext)

  if (!actions) {
    throw new Error(
      'useArticleActionsContext must be used within ArticleActionsProvider',
    )
  }

  return actions
}

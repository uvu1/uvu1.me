import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { getArticleBySlug } from '../../../lib/articles'
import { getOrCreateLikeClientId } from '../../../lib/cookie'
import { checkLikeRateLimit } from '../../../lib/like-ratelimit'

type LikeRow = {
  count: number
}

type ClientLikedRow = {
  liked: number
}

const ALLOWED_ORIGINS = new Set(['https://uvu1.me', 'http://localhost:3000'])

function getLikeCookieSecret() {
  const secret = (env as { LIKE_COOKIE_SECRET?: string }).LIKE_COOKIE_SECRET

  if (!secret) {
    throw new Error('LIKE_COOKIE_SECRET is not set in environment variables')
  }

  return secret
}

function json(
  data: unknown,
  init?: ResponseInit & {
    setCookie?: string
  },
) {
  const headers = new Headers(init?.headers)

  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')

  if (init?.setCookie) {
    headers.append('set-cookie', init.setCookie)
  }

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  })
}

function isAllowedOrigin(requrest: Request) {
  const origin = requrest.headers.get('origin')

  return origin && ALLOWED_ORIGINS.has(origin)
}

function getExistingArticleSlug(slug: string) {
  let decodedSlug: string

  try {
    decodedSlug = decodeURIComponent(slug)
  } catch {
    return undefined
  }

  const article = getArticleBySlug(decodedSlug)

  return article?.slug
}

async function getLikeState(slug: string, clientId: string) {
  const likeRow = await env.DB.prepare(
    'SELECT count FROM article_likes WHERE slug = ?',
  )
    .bind(slug)
    .first<LikeRow>()

  const likedRow = clientId
    ? await env.DB.prepare(
        'SELECT 1 AS liked FROM article_like_clients WHERE slug = ? AND client_id = ?',
      )
        .bind(slug, clientId)
        .first<ClientLikedRow>()
    : null

  return {
    slug,
    count: likeRow?.count ?? 0,
    liked: Boolean(likedRow?.liked),
  }
}

export const Route = createFileRoute('/api/likes/$slug')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const slug = getExistingArticleSlug(params.slug)

        if (!slug) {
          return json({ error: 'Article not found' }, { status: 404 })
        }

        const { clientId, setCookie } = await getOrCreateLikeClientId(
          request,
          getLikeCookieSecret(),
        )

        return json(await getLikeState(slug, clientId), { setCookie })
      },

      POST: async ({ request, params }) => {
        if (!isAllowedOrigin(request)) {
          return json({ error: 'Forbidden' }, { status: 403 })
        }
        const slug = getExistingArticleSlug(params.slug)

        if (!slug) {
          return json({ error: 'Article not found' }, { status: 404 })
        }

        const { clientId, setCookie } = await getOrCreateLikeClientId(
          request,
          getLikeCookieSecret(),
        )

        const rateLimit = await checkLikeRateLimit({
          db: env.DB,
          request,
          slug,
          clientId,
        })

        if (!rateLimit.allowed) {
          return json(
            { error: 'Too many requests', reset: rateLimit.reset },
            { status: 429, setCookie, headers: rateLimit.headers },
          )
        }

        const body = (await request.json().catch(() => null)) as {
          liked?: boolean
        } | null

        if (typeof body?.liked !== 'boolean') {
          return json({ error: 'liked must be boolean' }, { status: 400 })
        }

        if (body.liked) {
          const inserted = await env.DB.prepare(
            'INSERT OR IGNORE INTO article_like_clients (slug, client_id) VALUES (?, ?)',
          )
            .bind(slug, clientId)
            .run()

          if (inserted.meta.changes > 0) {
            await env.DB.prepare(
              `
              INSERT INTO article_likes (slug, count, updated_at)
              VALUES (?, 1, CURRENT_TIMESTAMP)
              ON CONFLICT(slug) DO UPDATE SET
                count = count + 1,
                updated_at = CURRENT_TIMESTAMP
              `,
            )
              .bind(slug)
              .run()
          }
        } else {
          const deleted = await env.DB.prepare(
            'DELETE FROM article_like_clients WHERE slug = ? AND client_id = ?',
          )
            .bind(slug, clientId)
            .run()

          if (deleted.meta.changes > 0) {
            await env.DB.prepare(
              `
              UPDATE article_likes
              SET
                count = MAX(count - 1, 0),
                updated_at = CURRENT_TIMESTAMP
              WHERE slug = ?
              `,
            )
              .bind(slug)
              .run()
          }
        }

        return json(await getLikeState(slug, clientId), { setCookie })
      },
    },
  },
})

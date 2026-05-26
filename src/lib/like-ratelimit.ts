type RateLimitRow = {
  count: number
}

export type LikeRateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter: number
  headers: HeadersInit
}

const CLIENT_WINDOW_SECONDS = 60
const CLIENT_MAX_REQUESTS = 20

const IP_WINDOW_SECONDS = 60
const IP_MAX_REQUESTS = 60

function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  )
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function createHeaders(result: Omit<LikeRateLimitResult, 'headers'>) {
  return {
    'x-ratelimit-limit': String(result.limit),
    'x-ratelimit-remaining': String(result.remaining),
    'x-ratelimit-reset': String(result.reset),
    ...(result.allowed
      ? {}
      : {
          'retry-after': String(result.retryAfter),
        }),
  }
}

async function hitRateLimit(params: {
  db: D1Database
  key: string
  limit: number
  windowSeconds: number
}) {
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - (now % params.windowSeconds)
  const reset = windowStart + params.windowSeconds

  const row = await params.db
    .prepare(
      `
      INSERT INTO like_rate_limits (rate_key, window_start, count, updated_at)
      VALUES (?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(rate_key) DO UPDATE SET
        window_start = CASE
          WHEN like_rate_limits.window_start = excluded.window_start
            THEN like_rate_limits.window_start
          ELSE excluded.window_start
        END,
        count = CASE
          WHEN like_rate_limits.window_start = excluded.window_start
            THEN like_rate_limits.count + 1
          ELSE 1
        END,
        updated_at = CURRENT_TIMESTAMP
      RETURNING count
      `,
    )
    .bind(params.key, windowStart)
    .first<RateLimitRow>()

  const count = row?.count ?? params.limit + 1
  const allowed = count <= params.limit
  const remaining = Math.max(0, params.limit - count)
  const retryAfter = Math.max(1, reset - now)

  return {
    allowed,
    limit: params.limit,
    remaining,
    reset,
    retryAfter,
    headers: createHeaders({
      allowed,
      limit: params.limit,
      remaining,
      reset,
      retryAfter,
    }),
  } satisfies LikeRateLimitResult
}

function moreRestrictive(
  a: LikeRateLimitResult,
  b: LikeRateLimitResult,
): LikeRateLimitResult {
  if (!a.allowed) return a
  if (!b.allowed) return b

  return a.remaining <= b.remaining ? a : b
}

export async function checkLikeRateLimit(params: {
  db: D1Database
  request: Request
  slug: string
  clientId: string
}) {
  const ip = getClientIp(params.request)

  const clientKey = await sha256(
    `likes:client:${params.slug}:${params.clientId}`,
  )

  const ipKey = await sha256(`likes:ip:${params.slug}:${ip}`)

  const clientLimit = await hitRateLimit({
    db: params.db,
    key: clientKey,
    limit: CLIENT_MAX_REQUESTS,
    windowSeconds: CLIENT_WINDOW_SECONDS,
  })

  const ipLimit = await hitRateLimit({
    db: params.db,
    key: ipKey,
    limit: IP_MAX_REQUESTS,
    windowSeconds: IP_WINDOW_SECONDS,
  })

  return moreRestrictive(clientLimit, ipLimit)
}

import startWorker from '@tanstack/react-start/server-entry'
import { withSecurityHeaders } from './lib/security-headers'

type FetchHandler = {
  fetch: (
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ) => Promise<Response>
}

type WebVitalsPayload = {
  metric: {
    id?: string
    name: WebVitalsMetricName
    value: number
    delta?: number
    rating?: WebVitalsRating
    navigationType?: WebVitalsNavigationType
  }
  path: string
  url: string | null
  viewport?: {
    width?: number
    height?: number
  }
  connectionType?: string | null
}

type WebVitalsMetricName = 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB'

type WebVitalsRating = 'good' | 'needs-improvement' | 'poor'

type WebVitalsNavigationType =
  | 'navigate'
  | 'reload'
  | 'back-forward'
  | 'back-forward-cache'
  | 'prerender'
  | 'restore'

type RateLimitRow = {
  count: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter: number
  headers: HeadersInit
}

const handler = startWorker as FetchHandler

const ALLOWED_VITALS_ORIGINS = new Set([
  'https://uvu1.me',
  'http://localhost:3000',
])

const ALLOWED_METRIC_NAMES = new Set<WebVitalsMetricName>([
  'CLS',
  'INP',
  'LCP',
  'FCP',
  'TTFB',
])

const ALLOWED_RATINGS = new Set<WebVitalsRating>([
  'good',
  'needs-improvement',
  'poor',
])

const ALLOWED_NAVIGATION_TYPES = new Set<WebVitalsNavigationType>([
  'navigate',
  'reload',
  'back-forward',
  'back-forward-cache',
  'prerender',
  'restore',
])

const MAX_VITALS_BODY_BYTES = 8_192
const VITALS_WINDOW_SECONDS = 60
const VITALS_MAX_REQUESTS_PER_WINDOW = 60

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function isAllowedVitalsOrigin(request: Request) {
  const origin = request.headers.get('origin')

  if (!origin) {
    return false
  }

  return ALLOWED_VITALS_ORIGINS.has(origin)
}

function isValidJsonRequest(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''

  return contentType.includes('application/json')
}

function isAllowedContentLength(request: Request) {
  const contentLengthHeader = request.headers.get('content-length')

  if (!contentLengthHeader) {
    return true
  }

  const contentLength = Number(contentLengthHeader)

  if (!Number.isFinite(contentLength)) {
    return false
  }

  return contentLength <= MAX_VITALS_BODY_BYTES
}

function normalizePath(value: unknown) {
  if (typeof value !== 'string') {
    return '/'
  }

  try {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const url = new URL(value)
      return normalizePath(url.pathname)
    }
  } catch {
    return '/'
  }

  if (!value.startsWith('/')) {
    return '/'
  }

  return value.slice(0, 512)
}

function normalizeUrl(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  try {
    const url = new URL(value)

    return `${url.origin}${url.pathname}`.slice(0, 1024)
  } catch {
    return null
  }
}

function parseMetricName(value: unknown): WebVitalsMetricName | null {
  if (typeof value !== 'string') {
    return null
  }

  if (!ALLOWED_METRIC_NAMES.has(value as WebVitalsMetricName)) {
    return null
  }

  return value as WebVitalsMetricName
}

function parseRating(value: unknown): WebVitalsRating | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  if (!ALLOWED_RATINGS.has(value as WebVitalsRating)) {
    return undefined
  }

  return value as WebVitalsRating
}

function parseNavigationType(value: unknown): WebVitalsNavigationType | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  if (!ALLOWED_NAVIGATION_TYPES.has(value as WebVitalsNavigationType)) {
    return undefined
  }

  return value as WebVitalsNavigationType
}

function parseWebVitalsPayload(value: unknown): WebVitalsPayload | null {
  if (!isObject(value)) {
    return null
  }

  const metric = value.metric

  if (!isObject(metric)) {
    return null
  }

  const name = parseMetricName(metric.name)

  if (!name) {
    return null
  }

  if (!isFiniteNumber(metric.value)) {
    return null
  }

  return {
    metric: {
      id: typeof metric.id === 'string' ? metric.id.slice(0, 128) : undefined,
      name,
      value: clampNumber(metric.value, 0, 10_000_000),
      delta: isFiniteNumber(metric.delta)
        ? clampNumber(metric.delta, -10_000_000, 10_000_000)
        : undefined,
      rating: parseRating(metric.rating),
      navigationType: parseNavigationType(metric.navigationType),
    },
    path: normalizePath(value.path),
    url: normalizeUrl(value.url),
    viewport: isObject(value.viewport)
      ? {
          width: isFiniteNumber(value.viewport.width)
            ? Math.round(clampNumber(value.viewport.width, 0, 10_000))
            : undefined,
          height: isFiniteNumber(value.viewport.height)
            ? Math.round(clampNumber(value.viewport.height, 0, 10_000))
            : undefined,
        }
      : undefined,
    connectionType:
      typeof value.connectionType === 'string'
        ? value.connectionType.slice(0, 32)
        : null,
  }
}

function getClientIp(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function createRateLimitHeaders(result: Omit<RateLimitResult, 'headers'>) {
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

async function checkWebVitalsRateLimit(db: D1Database, request: Request) {
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - (now % VITALS_WINDOW_SECONDS)
  const reset = windowStart + VITALS_WINDOW_SECONDS
  const ip = getClientIp(request)
  const key = await sha256(`web-vitals:ip:${ip}`)

  const row = await db
    .prepare(
      `
      INSERT INTO web_vitals_rate_limits (
        rate_key,
        window_start,
        count,
        updated_at
      )
      VALUES (?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(rate_key) DO UPDATE SET
        window_start = CASE
          WHEN web_vitals_rate_limits.window_start = excluded.window_start
            THEN web_vitals_rate_limits.window_start
          ELSE excluded.window_start
        END,
        count = CASE
          WHEN web_vitals_rate_limits.window_start = excluded.window_start
            THEN web_vitals_rate_limits.count + 1
          ELSE 1
        END,
        updated_at = CURRENT_TIMESTAMP
      RETURNING count
      `,
    )
    .bind(key, windowStart)
    .first<RateLimitRow>()

  const count = row?.count ?? VITALS_MAX_REQUESTS_PER_WINDOW + 1
  const allowed = count <= VITALS_MAX_REQUESTS_PER_WINDOW
  const remaining = Math.max(0, VITALS_MAX_REQUESTS_PER_WINDOW - count)
  const retryAfter = Math.max(1, reset - now)

  return {
    allowed,
    limit: VITALS_MAX_REQUESTS_PER_WINDOW,
    remaining,
    reset,
    retryAfter,
    headers: createRateLimitHeaders({
      allowed,
      limit: VITALS_MAX_REQUESTS_PER_WINDOW,
      remaining,
      reset,
      retryAfter,
    }),
  } satisfies RateLimitResult
}

async function insertWebVitals(db: D1Database, body: WebVitalsPayload) {
  const metric = body.metric

  await db
    .prepare(
      `
      INSERT INTO web_vitals (
        metric_id,
        name,
        value,
        delta,
        rating,
        navigation_type,
        path,
        url,
        viewport_width,
        viewport_height,
        connection_type,
        attribution
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .bind(
      metric.id ?? crypto.randomUUID(),
      metric.name,
      metric.value,
      metric.delta ?? null,
      metric.rating ?? null,
      metric.navigationType ?? null,
      body.path,
      body.url,
      body.viewport?.width ?? null,
      body.viewport?.height ?? null,
      body.connectionType ?? null,
      null,
    )
    .run()
}

async function handleVitals(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    })
  }

  if (!isAllowedVitalsOrigin(request)) {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  if (!isValidJsonRequest(request)) {
    return new Response('Unsupported Media Type', { status: 415 })
  }

  if (!isAllowedContentLength(request)) {
    return new Response('Payload Too Large', { status: 413 })
  }

  const rateLimit = await checkWebVitalsRateLimit(env.DB, request)

  if (!rateLimit.allowed) {
    return Response.json(
      { ok: false, error: 'Too many requests' },
      {
        status: 429,
        headers: rateLimit.headers,
      },
    )
  }

  const rawBody = await request.json().catch(() => null)
  const body = parseWebVitalsPayload(rawBody)

  if (!body) {
    return Response.json(
      { ok: false, error: 'invalid payload' },
      { status: 400 },
    )
  }

  await insertWebVitals(env.DB, body)

  return Response.json({ ok: true })
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === '/api/vitals') {
      const response = await handleVitals(request, env)
      return withSecurityHeaders(request, response)
    }

    const response = await handler.fetch(request, env, ctx)
    return withSecurityHeaders(request, response)
  },
}

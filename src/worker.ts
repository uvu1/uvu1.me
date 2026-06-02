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
    name: string
    value: number
    delta?: number
    rating?: string
    navigationType?: string
    attribution?: unknown
  }
  path?: string
  url?: string
  viewport?: {
    width?: number
    height?: number
  }
  connectionType?: string | null
}

const handler = startWorker as FetchHandler

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function parseWebVitalsPayload(value: unknown): WebVitalsPayload | null {
  if (!isObject(value)) {
    return null
  }

  const metric = value.metric

  if (!isObject(metric)) {
    return null
  }

  if (typeof metric.name !== 'string' || typeof metric.value !== 'number') {
    return null
  }

  return {
    metric: {
      id: typeof metric.id === 'string' ? metric.id : undefined,
      name: metric.name,
      value: metric.value,
      delta: typeof metric.delta === 'number' ? metric.delta : undefined,
      rating: typeof metric.rating === 'string' ? metric.rating : undefined,
      navigationType:
        typeof metric.navigationType === 'string'
          ? metric.navigationType
          : undefined,
      attribution: metric.attribution,
    },
    path: typeof value.path === 'string' ? value.path : undefined,
    url: typeof value.url === 'string' ? value.url : undefined,
    viewport: isObject(value.viewport)
      ? {
          width:
            typeof value.viewport.width === 'number'
              ? value.viewport.width
              : undefined,
          height:
            typeof value.viewport.height === 'number'
              ? value.viewport.height
              : undefined,
        }
      : undefined,
    connectionType:
      typeof value.connectionType === 'string' ? value.connectionType : null,
  }
}

async function handleVitals(request: Request, env: Env) {
  const origin = request.headers.get('origin')
  const allowedOrigins = new Set(['https://uvu1.me'])

  if (origin && !allowedOrigins.has(origin)) {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > 16_384) {
    return new Response('Payload Too Large', { status: 413 })
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return new Response('Unsupported Media Type', { status: 415 })
  }
  const rawBody = await request.json().catch(() => null)
  const body = parseWebVitalsPayload(rawBody)
  if (!body)
    return Response.json(
      { ok: false, error: 'invalid payload' },
      { status: 400 },
    )

  const metric = body.metric
  const path = body.path ?? '/'

  await env.DB.prepare(
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
      path,
      body.url ?? null,
      body.viewport?.width ?? null,
      body.viewport?.height ?? null,
      body.connectionType ?? null,
      metric.attribution ? JSON.stringify(metric.attribution) : null,
    )
    .run()

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

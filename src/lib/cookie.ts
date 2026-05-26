const CLIENT_ID_COOKIE = 'uvu1_client_id'
const CLIENT_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

const CLIENT_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type CookieOptions = {
  path?: string
  maxAge?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

type LikeClientCookieResult = {
  clientId: string
  setCookie?: string
}

export function parseCookies(cookieHeader: string | null) {
  const cookies = new Map<string, string>()

  if (!cookieHeader) {
    return cookies
  }

  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim()
    const index = trimmed.indexOf('=')

    if (index === -1) {
      continue
    }

    const name = trimmed.slice(0, index)
    const value = trimmed.slice(index + 1)

    try {
      cookies.set(decodeURIComponent(name), decodeURIComponent(value))
    } catch {
      // malformed cookie は無視
    }
  }

  return cookies
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]

  if (options.path) {
    parts.push(`Path=${options.path}`)
  }

  if (typeof options.maxAge === 'number') {
    parts.push(`Max-Age=${options.maxAge}`)
  }

  if (options.httpOnly) {
    parts.push('HttpOnly')
  }

  if (options.secure) {
    parts.push('Secure')
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`)
  }

  return parts.join('; ')
}

function base64UrlEncode(buffer: ArrayBuffer) {
  let binary = ''

  for (const byte of new Uint8Array(buffer)) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

async function createSignature(clientId: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(clientId),
  )

  return base64UrlEncode(signature)
}

function timingSafeEqual(a: string, b: string) {
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  const length = Math.max(aBytes.length, bBytes.length)

  let diff = aBytes.length ^ bBytes.length

  for (let i = 0; i < length; i += 1) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
  }

  return diff === 0
}

async function createSignedClientId(clientId: string, secret: string) {
  const normalizedClientId = clientId.toLowerCase()
  const signature = await createSignature(normalizedClientId, secret)

  return `${normalizedClientId}.${signature}`
}

async function verifySignedClientId(value: string, secret: string) {
  const [clientId, signature, ...rest] = value.split('.')

  if (rest.length > 0 || !clientId || !signature) {
    return undefined
  }

  const normalizedClientId = clientId.trim().toLowerCase()

  if (!CLIENT_ID_RE.test(normalizedClientId)) {
    return undefined
  }

  const expectedSignature = await createSignature(normalizedClientId, secret)

  if (!timingSafeEqual(signature, expectedSignature)) {
    return undefined
  }

  return normalizedClientId
}

export async function getLikeClientIdFromCookie(
  request: Request,
  secret: string,
) {
  const cookies = parseCookies(request.headers.get('cookie'))
  const value = cookies.get(CLIENT_ID_COOKIE)

  if (!value) {
    return undefined
  }

  return verifySignedClientId(value, secret)
}

export async function createLikeClientIdCookie(
  clientId: string,
  secret: string,
) {
  const signedClientId = await createSignedClientId(clientId, secret)

  return serializeCookie(CLIENT_ID_COOKIE, signedClientId, {
    path: '/',
    maxAge: CLIENT_ID_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  })
}

export async function getOrCreateLikeClientId(
  request: Request,
  secret: string,
): Promise<LikeClientCookieResult> {
  const existingClientId = await getLikeClientIdFromCookie(request, secret)

  if (existingClientId) {
    return {
      clientId: existingClientId,
    }
  }

  const clientId = crypto.randomUUID()
  const setCookie = await createLikeClientIdCookie(clientId, secret)

  return {
    clientId,
    setCookie,
  }
}

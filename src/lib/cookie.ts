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

export function getLikeClientIdFromCookie(request: Request) {
  const cookies = parseCookies(request.headers.get('cookie'))
  const clientId = cookies.get(CLIENT_ID_COOKIE)?.trim().toLowerCase()

  if (!clientId || !CLIENT_ID_RE.test(clientId)) {
    return undefined
  }

  return clientId
}

export function createLikeClientIdCookie(clientId: string) {
  return serializeCookie(CLIENT_ID_COOKIE, clientId, {
    path: '/',
    maxAge: CLIENT_ID_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  })
}

export function getOrCreateLikeClientId(request: Request) {
  const existingClientId = getLikeClientIdFromCookie(request)

  if (existingClientId) {
    return {
      clientId: existingClientId,
      setCookie: undefined,
    }
  }

  const clientId = crypto.randomUUID()

  return {
    clientId,
    setCookie: createLikeClientIdCookie(clientId),
  }
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'accelerometer=()',
    'gyroscope=()',
    'magnetometer=()',
  ].join(', '),
  'X-XSS-Protection': '0',
} as const

const PRODUCTION_ONLY_SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://use.typekit.net",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://use.typekit.net https://p.typekit.net",
  "connect-src 'self' https://p.typekit.net",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  'upgrade-insecure-requests',
].join('; ')

function isHtmlResponse(headers: Headers) {
  const contentType = headers.get('content-type')
  return contentType?.includes('text/html') ?? false
}

function isHttpsRequest(request: Request) {
  const url = new URL(request.url)

  return (
    url.protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https'
  )
}

export function withSecurityHeaders(request: Request, response: Response) {
  const headers = new Headers(response.headers)

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value)
  }

  headers.delete('X-Powered-By')
  headers.delete('Server')

  if (isHttpsRequest(request)) {
    for (const [name, value] of Object.entries(
      PRODUCTION_ONLY_SECURITY_HEADERS,
    )) {
      headers.set(name, value)
    }
  }

  if (isHtmlResponse(headers)) {
    headers.set('Content-Security-Policy', CSP)
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

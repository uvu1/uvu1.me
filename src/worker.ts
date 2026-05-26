import startWorker from '@tanstack/react-start/server-entry'
import { withSecurityHeaders } from './lib/security-headers'

type FetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>
}

const handler = startWorker as FetchHandler

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const response = await handler.fetch(request, env, ctx)

    return withSecurityHeaders(request, response)
  },
}

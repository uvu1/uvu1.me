type Bindings = {
  DB: D1Database
}

declare module 'cloudflare:workers' {
  export const env: Bindings
}

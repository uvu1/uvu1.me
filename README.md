# uvu1.me v2

`uvu1.me` の個人サイトです。記事、タグ、プロジェクト一覧、RSS、サイトマップ、記事サムネイルを生成して Cloudflare Workers にデプロイします。

## Stack

- TanStack Start / TanStack Router
- React
- TypeScript
- Tailwind CSS
- Cloudflare Workers / D1
- Bun

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

`dev` は記事、プロジェクト、RSS、サイトマップ、robots.txt を生成してから Vite dev server を起動します。

## Build

```bash
bun run build
```

## Test

```bash
bun run test
bun run test:run
```

## Quality Checks

```bash
bun run lint
bun run check
```

## Content Generation

```bash
bun run generate:contents
```

個別に実行する場合:

```bash
bun run generate:thumbs
bun run generate:projects
bun run generate:rss
bun run generate:sitemap
bun run generate:robots
```

生成対象:

- `src/generated/articles.ts`
- `src/generated/projects.ts`
- `public/article-thumbs/*`
- `public/rss.xml`
- `public/sitemap.xml`
- `public/robots.txt`

## Content

記事は `src/content/articles`、プロジェクトは `src/content/projects` に Markdown で配置します。

## Deploy

```bash
bun run deploy
```

Cloudflare Workers の設定は `wrangler.jsonc` を参照します。D1 の likes API は `migrations/01_likes.sql` の schema を使用します。

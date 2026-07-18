import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

const rootDir = process.cwd()

// ブラウザ実体は Nix 提供(.playwright-browsers は nix store への GC ルート symlink)
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(
  rootDir,
  '.playwright-browsers',
)
process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ??= 'true'
// システムに fontconfig/フォントが無いため、日本語フォントは .fonts/ から解決する
process.env.FONTCONFIG_FILE ??= path.join(rootDir, 'scripts/fonts.conf')

const { chromium, firefox } = await import('playwright')

const usage = `Usage: bun scripts/screenshot.ts <path|url> [<path|url> ...] [options]

Options:
  --browser <chromium|firefox|all>  default: all
  --width <px>                      viewport width, default: 1280
  --height <px>                     viewport height, default: 800
  --full                            full-page screenshot (default: viewport only)
  --dark                            prefers-color-scheme: dark
  --out <dir>                       output dir, default: .screenshots

Examples:
  bun scripts/screenshot.ts /
  bun scripts/screenshot.ts /about --browser firefox --full --dark`

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    browser: { type: 'string', default: 'all' },
    width: { type: 'string', default: '1280' },
    height: { type: 'string', default: '800' },
    full: { type: 'boolean', default: false },
    dark: { type: 'boolean', default: false },
    out: { type: 'string', default: '.screenshots' },
  },
})

if (positionals.length === 0) {
  console.error(usage)
  process.exit(1)
}

const launchers = { chromium, firefox }
const browserNames =
  values.browser === 'all'
    ? (['chromium', 'firefox'] as const)
    : [values.browser]

for (const name of browserNames) {
  if (!(name in launchers)) {
    console.error(`Unknown browser: ${name}\n\n${usage}`)
    process.exit(1)
  }
}

const urls = positionals.map((p) =>
  p.startsWith('http') ? p : new URL(p, 'http://localhost:3000').href,
)

for (const url of urls) {
  const reachable = await fetch(url, {
    signal: AbortSignal.timeout(3000),
  }).catch(() => null)
  if (!reachable) {
    console.error(
      `${url} に接続できません。先に dev サーバーを起動してください: bun run dev`,
    )
    process.exit(1)
  }
}

const outDir = path.join(rootDir, values.out)
await mkdir(outDir, { recursive: true })

const slugOf = (url: string) => {
  const { pathname } = new URL(url)
  return pathname === '/'
    ? 'home'
    : pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-')
}

for (const name of browserNames as ('chromium' | 'firefox')[]) {
  const browser = await launchers[name].launch()
  const context = await browser.newContext({
    viewport: { width: Number(values.width), height: Number(values.height) },
    colorScheme: values.dark ? 'dark' : 'light',
  })
  for (const url of urls) {
    const page = await context.newPage()
    // dev サーバーは HMR 接続で networkidle に到達しないため load + 整定待ち
    await page.goto(url, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    const suffix = values.dark ? '-dark' : ''
    const file = path.join(outDir, `${slugOf(url)}-${name}${suffix}.png`)
    await page.screenshot({ path: file, fullPage: values.full })
    console.log(file)
    await page.close()
  }
  await browser.close()
}

# uvu1.me

TanStack Start + Vite + React 19。パッケージマネージャは Bun(mise で 1.3.14 固定)。

- dev サーバー: `bun run dev`(port 3000。事前に `generate:contents` が走るため submodule `src/content/articles` の初期化が必要)
- チェック一式: `bun run ci`

## 見た目の確認(headless Chromium / Firefox)

UI に触る変更をしたら、スクリーンショットを撮って実際のレンダリングを目視確認すること:

```sh
bun run dev &          # 起動済みならスキップ
bun scripts/screenshot.ts / /about --full
bun scripts/screenshot.ts / --dark   # ダークモード
```

- 出力は `.screenshots/*.png`(gitignore 済み)。Read ツールで開いて確認する
- デフォルトで Chromium と Firefox の両方で撮る(`--browser chromium|firefox|all`)
- ブラウザ実体は Nix 提供。リポジトリ直下の `.playwright-browsers` symlink が
  `/nix/store/...-playwright-browsers` への GC ルートで、`PLAYWRIGHT_BROWSERS_PATH` は
  このリンク経由で解決される(`.claude/settings.local.json` の env とスクリプト内の両方で設定)
- このマシンはシステムフォントが皆無なので、日本語・絵文字・記号は `.fonts/` 配下の
  Nix symlink(noto-cjk / noto-emoji / noto、いずれも GC ルート)+ `scripts/fonts.conf` を
  `FONTCONFIG_FILE` で指定して解決している。豆腐(□)が出たらこの構成を疑うこと

### symlink が切れた場合の復旧

ブラウザ(nixpkgs の playwright バージョンと `@playwright/test` を一致させる):

```sh
nix build nixpkgs#playwright-driver.browsers -o .playwright-browsers
bun add -d @playwright/test@$(nix eval --raw nixpkgs#playwright-driver.version)
```

一致確認: `node_modules/playwright-core/browsers.json` の chromium / firefox / webkit の
revision と `.playwright-browsers/` 配下のディレクトリ名が揃っていること。

フォント:

```sh
nix build nixpkgs#noto-fonts-cjk-sans -o .fonts/noto-cjk
nix build nixpkgs#noto-fonts-color-emoji -o .fonts/noto-emoji
nix build nixpkgs#noto-fonts -o .fonts/noto
```

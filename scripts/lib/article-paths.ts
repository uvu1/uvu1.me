import path from 'node:path'

export const ROOT = process.cwd()

export const CONTENT_DIR = path.join(ROOT, 'src/content/articles')
export const THUMBNAILS_DIR = path.join(ROOT, 'public/article-thumbs')
export const GENERATED_ARTICLES_PATH = path.join(
  ROOT,
  'src/generated/articles.ts',
)

export const BACKGROUND_PATH = path.join(ROOT, 'src/assets/background.png')
export const FONT_REGULAR_PATH = path.join(
  ROOT,
  'src/assets/fonts/NotoSansJP-Regular.ttf',
)
export const FONT_BOLD_PATH = path.join(
  ROOT,
  'src/assets/fonts/NotoSansJP-Bold.ttf',
)

export function isArticleFile(fileName: string) {
  return /\.(md|mdx)$/.test(fileName)
}

export function slugFromFileName(fileName: string) {
  return fileName.replace(/\.(md|mdx)$/, '')
}

export function normalizeTags(tags?: string[]) {
  return [...new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean))]
}

export function splitTitle(title: string, maxCharsPerLine = 18) {
  const text = title.trim()
  const lines: string[] = []
  let rest = text

  while (rest.length > maxCharsPerLine && lines.length < 2) {
    lines.push(rest.slice(0, maxCharsPerLine))
    rest = rest.slice(maxCharsPerLine)
  }

  lines.push(rest)
  return lines.slice(0, 3)
}

export function calculateReadingTime(markdown: string) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[[^\]]*]\([^)]*\)/g, '')
    .replace(/[#>*_\-|]/g, '')
    .trim()

  const japaneseChars = (plainText.match(/[\u3040-\u30ff\u3400-\u9fff]/g) ?? [])
    .length
  const latinWords = (plainText.match(/[A-Za-z0-9]+/g) ?? []).length

  const estimatedMinutes = Math.ceil(japaneseChars / 500 + latinWords / 220)

  return Math.max(1, estimatedMinutes)
}

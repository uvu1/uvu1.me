export function formatDate(date?: string) {
  return date ? date.replaceAll('-', '/') : ''
}

import { siteConfig } from '../../src/config/site'

export function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString()
}

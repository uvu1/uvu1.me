import { describe, expect, test } from 'vitest'
import { markdownToHtml } from '../../scripts/lib/markdown'

describe('markdownToHtml', () => {
  test('単一改行は<br>になる', async () => {
    const { html } = await markdownToHtml('一行目\n二行目')

    expect(html).toContain('<br>')
    expect(html).toContain('一行目')
    expect(html).toContain('二行目')
  })

  test('空行区切りは別々の<p>になる', async () => {
    const { html } = await markdownToHtml('一段落目\n\n二段落目')

    expect(html).not.toContain('<br>')
    expect(html.match(/<p>/g)).toHaveLength(2)
  })
})

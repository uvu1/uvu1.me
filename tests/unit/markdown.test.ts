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

  test('[!type]- コールアウトは閉じたdetailsになる', async () => {
    const { html } = await markdownToHtml('> [!note]- タイトル\n> 中身')

    expect(html).toContain('<details class="callout" data-callout="note">')
    expect(html).toContain('<summary>タイトル</summary>')
    expect(html).toContain('<p>中身</p>')
    expect(html).not.toContain('open')
    expect(html).not.toContain('<blockquote>')
  })

  test('[!type]+ コールアウトはopen付きdetailsになる', async () => {
    const { html } = await markdownToHtml('> [!tip]+ タイトル\n> 中身')

    expect(html).toContain('<details class="callout" data-callout="tip" open>')
  })

  test('タイトル省略時はタイプ名がsummaryになる', async () => {
    const { html } = await markdownToHtml('> [!note]-\n> 中身')

    expect(html).toContain('<summary>Note</summary>')
  })

  test('コールアウトの中身のmarkdownはレンダリングされる', async () => {
    const { html } = await markdownToHtml(
      '> [!note]- タイトル\n> **強調**あり\n>\n> 二段落目',
    )

    expect(html).toContain('<strong>強調</strong>')
    expect(html).toContain('<p>二段落目</p>')
  })

  test('折りたたみ記号なしのコールアウトはblockquoteのまま', async () => {
    const { html } = await markdownToHtml('> [!note] タイトル\n> 中身')

    expect(html).toContain('<blockquote>')
    expect(html).not.toContain('<details')
  })

  test('通常の引用はblockquoteのまま', async () => {
    const { html } = await markdownToHtml('> ただの引用')

    expect(html).toContain('<blockquote>')
    expect(html).not.toContain('<details')
  })
})

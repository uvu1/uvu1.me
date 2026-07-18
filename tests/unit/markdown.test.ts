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

describe('markdownToHtml wikiリンク', () => {
  const articles = new Map([
    ['my-post', { slug: 'my-post', title: '記事タイトル' }],
  ])

  function createOptions(unresolved: string[] = []) {
    return {
      resolveArticle: (slug: string) => articles.get(slug) ?? null,
      onUnresolved: (source: string) => {
        unresolved.push(source)
      },
    }
  }

  test('[[slug/index]] は記事リンクになり表示はタイトル', async () => {
    const { html } = await markdownToHtml('[[my-post/index]]', createOptions())

    expect(html).toContain('<a href="/articles/my-post">記事タイトル</a>')
  })

  test('bareなslugやvault内パス付きでも解決される', async () => {
    const { html } = await markdownToHtml(
      '[[my-post]] と [[vault/my-post/index]]',
      createOptions(),
    )

    expect(html.match(/href="\/articles\/my-post"/g)).toHaveLength(2)
  })

  test('|エイリアスは表示テキストになる', async () => {
    const { html } = await markdownToHtml(
      '[[my-post/index|別名で]]',
      createOptions(),
    )

    expect(html).toContain('<a href="/articles/my-post">別名で</a>')
  })

  test('#見出しはアンカー付きリンクになる', async () => {
    const { html } = await markdownToHtml(
      '[[my-post/index#見出し テスト]]',
      createOptions(),
    )

    expect(html).toContain(
      'href="/articles/my-post#user-content-見出し-テスト"',
    )
  })

  test('[[#見出し]] のアンカーは実際の見出しIDと一致する', async () => {
    const { html } = await markdownToHtml(
      '## 見出し\n\n[[#見出し]]',
      createOptions(),
    )
    const id = html.match(/<h2 id="([^"]+)"/)?.[1]

    expect(id).toBeTruthy()
    expect(html).toContain(`<a href="#${id}">見出し</a>`)
  })

  test('未解決リンクはプレーンテキストになり通知される', async () => {
    const unresolved: string[] = []
    const { html } = await markdownToHtml(
      '[[secret-note]]',
      createOptions(unresolved),
    )

    expect(html).not.toContain('<a')
    expect(html).toContain('secret-note')
    expect(unresolved).toEqual(['[[secret-note]]'])
  })

  test('インラインコード内の[[...]]は変換されない', async () => {
    const { html } = await markdownToHtml('`[[my-post]]`', createOptions())

    expect(html).not.toContain('<a')
    expect(html).toContain('[[my-post]]')
  })

  test('![[...]]埋め込みはそのまま残り通知される', async () => {
    const unresolved: string[] = []
    const { html } = await markdownToHtml(
      '![[image.png]]',
      createOptions(unresolved),
    )

    expect(html).toContain('![[image.png]]')
    expect(unresolved).toEqual(['![[image.png]]'])
  })

  test('オプション未指定なら[[...]]はそのまま', async () => {
    const { html } = await markdownToHtml('[[my-post]]')

    expect(html).not.toContain('<a')
    expect(html).toContain('[[my-post]]')
  })
})

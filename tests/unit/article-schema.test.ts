import { describe, expect, test } from 'vitest'
import { ArticleFrontmatterSchema } from '../../scripts/lib/article-schema'

describe('ArticleFrontmatterSchema', () => {
  test('valid frontmatterを通す', () => {
    const parsed = ArticleFrontmatterSchema.parse({
      title: 'Test Article',
      description: '表示確認用の記事です。',
      date: '2026-05-21',
      tags: ['test', 'markdown'],
      pin: true,
      draft: false,
    })

    expect(parsed).toEqual({
      title: 'Test Article',
      description: '表示確認用の記事です。',
      date: '2026-05-21',
      tags: ['test', 'markdown'],
      pin: true,
      draft: false,
    })
  })

  test('optional fieldsにdefaultが入る', () => {
    const parsed = ArticleFrontmatterSchema.parse({
      title: 'Test Article',
      date: '2026-05-21',
    })

    expect(parsed).toEqual({
      title: 'Test Article',
      description: '',
      date: '2026-05-21',
      tags: [],
      pin: false,
      draft: false,
    })
  })

  test('titleが空文字なら落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      title: '',
      date: '2026-05-21',
    })

    expect(result.success).toBe(false)
  })

  test('titleがないなら落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      date: '2026-05-21',
    })

    expect(result.success).toBe(false)
  })

  test('dateがYYYY-MM-DDでなければ落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      title: 'Test Article',
      date: '2026/05/21',
    })

    expect(result.success).toBe(false)
  })

  test('tagsが配列でなければ落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      title: 'Test Article',
      date: '2026-05-21',
      tags: 'test',
    })

    expect(result.success).toBe(false)
  })

  test('tagsに空文字が含まれていたら落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      title: 'Test Article',
      date: '2026-05-21',
      tags: ['test', ''],
    })

    expect(result.success).toBe(false)
  })

  test('draftならtagsに空文字が含まれていても通る', () => {
    const parsed = ArticleFrontmatterSchema.parse({
      title: 'Test Article',
      date: '2026-05-21',
      draft: true,
      tags: ['test', ''],
    })

    expect(parsed.tags).toEqual(['test', ''])
  })

  test('draftならtagsが空欄(null)でも通り[]になる', () => {
    const parsed = ArticleFrontmatterSchema.parse({
      title: 'Test Article',
      date: '2026-05-21',
      draft: true,
      tags: null,
    })

    expect(parsed.tags).toEqual([])
  })

  test('非draftでもtagsが空欄(null)なら[]として通る', () => {
    const parsed = ArticleFrontmatterSchema.parse({
      title: 'Test Article',
      date: '2026-05-21',
      tags: null,
    })

    expect(parsed.tags).toEqual([])
  })

  test('draftでもtitleがないなら落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      date: '2026-05-21',
      draft: true,
    })

    expect(result.success).toBe(false)
  })

  test('pinがbooleanでなければ落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      title: 'Test Article',
      date: '2026-05-21',
      pin: 'true',
    })

    expect(result.success).toBe(false)
  })

  test('draftがbooleanでなければ落ちる', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      title: 'Test Article',
      date: '2026-05-21',
      draft: 'false',
    })

    expect(result.success).toBe(false)
  })
})

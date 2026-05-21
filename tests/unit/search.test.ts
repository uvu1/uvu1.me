import { describe, expect, test } from 'vitest'
import type { Article } from '../../src/lib/articles'
import {
  articleMatchesTags,
  escapeRegExp,
  normalizeText,
  parseQuery,
  scoreArticle,
  searchArticles,
  tokenize,
} from '../../src/lib/search'

function createArticle(partial: Partial<Article>): Article {
  return {
    slug: partial.slug ?? 'test',
    title: partial.title ?? 'Test Article',
    description: partial.description ?? '',
    date: partial.date ?? '2026-01-01',
    tags: partial.tags ?? [],
    pin: partial.pin ?? false,
    thumbnail: partial.thumbnail ?? '/article-thumbs/test.webp',
    body: partial.body ?? '',
    html: partial.html ?? '',
    toc: partial.toc ?? [],
    readingTime: partial.readingTime ?? 1,
  }
}

describe('normalizeText', () => {
  test('小文字化して前後空白を削除する', () => {
    expect(normalizeText('  TanStack  ')).toBe('tanstack')
  })

  test('NFKC正規化する', () => {
    expect(normalizeText('ＴａｎＳｔａｃｋ')).toBe('tanstack')
  })
})

describe('tokenize', () => {
  test('空白区切りで分割する', () => {
    expect(tokenize('TanStack   Markdown Search')).toEqual([
      'tanstack',
      'markdown',
      'search',
    ])
  })

  test('空白だけなら空配列を返す', () => {
    expect(tokenize('   ')).toEqual([])
  })
})

describe('parseQuery', () => {
  test('plain keywordをparseできる', () => {
    expect(parseQuery('TanStack Markdown')).toEqual({
      textQuery: 'TanStack Markdown',
      words: ['tanstack', 'markdown'],
      tagFilters: [],
    })
  })

  test('{tag: name} をparseできる', () => {
    expect(parseQuery('Markdown {tag: UI}')).toEqual({
      textQuery: 'Markdown',
      words: ['markdown'],
      tagFilters: ['UI'],
    })
  })

  test('tag only queryをparseできる', () => {
    expect(parseQuery('{tag: Web}')).toEqual({
      textQuery: '',
      words: [],
      tagFilters: ['Web'],
    })
  })

  test('複数tag filterをparseできる', () => {
    expect(parseQuery('{tag: UI} {tag: Web}')).toEqual({
      textQuery: '',
      words: [],
      tagFilters: ['UI', 'Web'],
    })
  })

  test('tag filterの前後空白を削除する', () => {
    expect(parseQuery('{tag:   Cloudflare   }')).toEqual({
      textQuery: '',
      words: [],
      tagFilters: ['Cloudflare'],
    })
  })

  test('tag filterは大文字小文字を問わずparseできる', () => {
    expect(parseQuery('Search {TAG: Web}')).toEqual({
      textQuery: 'Search',
      words: ['search'],
      tagFilters: ['Web'],
    })
  })
})

describe('articleMatchesTags', () => {
  test('tag filterが空ならtrue', () => {
    expect(
      articleMatchesTags(
        createArticle({
          tags: ['Web'],
        }),
        [],
      ),
    ).toBe(true)
  })

  test('指定tagを持つ記事にmatchする', () => {
    expect(
      articleMatchesTags(
        createArticle({
          tags: ['Web', 'UI'],
        }),
        ['Web'],
      ),
    ).toBe(true)
  })

  test('複数tag filterはANDになる', () => {
    expect(
      articleMatchesTags(
        createArticle({
          tags: ['Web', 'UI'],
        }),
        ['Web', 'UI'],
      ),
    ).toBe(true)

    expect(
      articleMatchesTags(
        createArticle({
          tags: ['Web'],
        }),
        ['Web', 'UI'],
      ),
    ).toBe(false)
  })

  test('tag filterは大文字小文字と全角半角を吸収する', () => {
    expect(
      articleMatchesTags(
        createArticle({
          tags: ['Ｗｅｂ'],
        }),
        ['web'],
      ),
    ).toBe(true)
  })
})

describe('scoreArticle', () => {
  test('tag filterにmatchしない場合は0', () => {
    const score = scoreArticle(
      createArticle({
        title: 'TanStack',
        tags: ['Web'],
      }),
      parseQuery('tanstack {tag: Infra}'),
    )

    expect(score).toBe(0)
  })

  test('queryが空でtag filterもない場合は0', () => {
    const score = scoreArticle(createArticle({ title: 'TanStack' }), {
      textQuery: '',
      words: [],
      tagFilters: [],
    })

    expect(score).toBe(0)
  })

  test('tag only queryの場合はscoreを返す', () => {
    const score = scoreArticle(
      createArticle({
        tags: ['Web'],
      }),
      parseQuery('{tag: Web}'),
    )

    expect(score).toBeGreaterThan(0)
  })

  test('title完全一致は高いscoreになる', () => {
    const exact = scoreArticle(
      createArticle({
        title: 'TanStack',
      }),
      parseQuery('tanstack'),
    )

    const body = scoreArticle(
      createArticle({
        title: 'Other',
        body: 'TanStack',
      }),
      parseQuery('tanstack'),
    )

    expect(exact).toBeGreaterThan(body)
  })
})

describe('searchArticles', () => {
  test('空queryでは結果を返さない', () => {
    const results = searchArticles(
      [
        createArticle({
          title: 'Hello',
        }),
      ],
      '',
    )

    expect(results).toHaveLength(0)
  })

  test('空白だけのqueryでは結果を返さない', () => {
    const results = searchArticles(
      [
        createArticle({
          title: 'Hello',
        }),
      ],
      '   ',
    )

    expect(results).toHaveLength(0)
  })

  test('titleで検索できる', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'a',
          title: 'TanStack Start',
        }),
        createArticle({
          slug: 'b',
          title: 'Neovim Config',
        }),
      ],
      'tanstack',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['a'])
  })

  test('descriptionで検索できる', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'a',
          title: 'A',
          description: 'Markdown renderer',
        }),
        createArticle({
          slug: 'b',
          title: 'B',
          description: 'Terminal UI',
        }),
      ],
      'markdown',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['a'])
  })

  test('bodyで検索できる', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'a',
          body: 'Cloudflare Workers tutorial',
        }),
        createArticle({
          slug: 'b',
          body: 'Neovim config',
        }),
      ],
      'workers',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['a'])
  })

  test('tagで絞り込める', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'web',
          tags: ['Web'],
        }),
        createArticle({
          slug: 'infra',
          tags: ['Infra'],
        }),
      ],
      '{tag: Web}',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['web'])
  })

  test('tag filterは複数指定できる', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'both',
          tags: ['UI', 'Web'],
        }),
        createArticle({
          slug: 'ui-only',
          tags: ['UI'],
        }),
      ],
      '{tag: UI} {tag: Web}',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['both'])
  })

  test('存在しないtagでは結果なし', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'web',
          title: 'TanStack',
          tags: ['Web'],
        }),
      ],
      'tanstack {tag: Infra}',
    )

    expect(results).toHaveLength(0)
  })

  test('複数keywordはAND検索になる', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'match',
          title: 'TanStack Markdown',
          body: 'Search article',
        }),
        createArticle({
          slug: 'miss',
          title: 'TanStack',
          body: 'No matching word',
        }),
      ],
      'tanstack markdown',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['match'])
  })

  test('異なるフィールドにある複数keywordもAND検索できる', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'match',
          title: 'TanStack',
          description: 'Markdown renderer',
        }),
        createArticle({
          slug: 'miss',
          title: 'TanStack',
          description: 'Article renderer',
        }),
      ],
      'tanstack markdown',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['match'])
  })

  test('title matchはbody matchより優先される', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'body',
          title: 'Other',
          body: 'TanStack',
        }),
        createArticle({
          slug: 'title',
          title: 'TanStack',
          body: '',
        }),
      ],
      'tanstack',
    )

    expect(results.map((result) => result.article.slug)).toEqual([
      'title',
      'body',
    ])
  })

  test('同じscoreならdateが新しい記事を優先する', () => {
    const results = searchArticles(
      [
        createArticle({
          slug: 'old',
          title: 'Markdown',
          date: '2024-01-01',
        }),
        createArticle({
          slug: 'new',
          title: 'Markdown',
          date: '2026-01-01',
        }),
      ],
      'markdown',
    )

    expect(results.map((result) => result.article.slug)).toEqual(['new', 'old'])
  })
})

describe('escapeRegExp', () => {
  test('正規表現の特殊文字をescapeする', () => {
    expect(escapeRegExp('a+b?')).toBe('a\\+b\\?')
  })
})

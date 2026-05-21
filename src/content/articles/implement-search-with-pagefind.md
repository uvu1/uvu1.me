---
title: Pagefind.jsで検索機能を実装する
tags: ['astro', 'pagefind']
date: '2024-11-27'
---

## 経緯

元々自前で実装しようとも思ってたけどめんどくさくなっちゃったのと良い感じのライブラリがあったのでそれを使うことにした！！

Pagefindは最小限の帯域幅で動作する静的全文検索エンジンで、ホスティングサービスなしで利用できる良い感じのライブラリです

## 導入

```bash
$ bun add pagefind @pagefind/default-ui
```

たった一行で終了です

簡単ですね

次に、インデックスを作成するために次のコマンドを実行します。

Astroの場合デフォルトで `dist`ディレクトリに成果物が生成されるため、次のように実行します

```bash
$ bunx pagefind -s dist
```

これによって、`dist/pagefindにインデックスが作成されます。`

また、これはビルド毎に行う必要がある（当たり前）なので、CI/CDにもこの工程を挟む必要があります

## 検索UIの追加

PagefindのデフォルトUIを使ってスタイリングなしで実装できます。

簡単ですね

```html
<div class="search" />
<script>
  import { PagefindUI } from '@pagefind/default-ui'
  new PagefindUI({
    element: '.search',
    translations: {
      placeholder: 'Search',
    },
  })
</script>
```

Pagefindでは言語がhtml.langから判別されてプレースホルダーなどの言語が設定されるのですが、今回はプレースホルダーのテキストを変更しています。

## インデックスする対象

タグに `data-pagefind-*`属性を付与することによって、インデックスする対象を設定することができます。

詳しくは[ドキュメント](https://pagefind.app/docs/indexing/)を参照してください

このサイトでは、記事のレイアウトの本文部分のみをインデックスして検索対象をブログのみに絞っています。

```html
...
<div class="text-left prose porse-h1:text-3xl" data-pagefind-body>
  <content />
</div>
...
```

## まとめ

めちゃ簡単に検索エンジンが入ってすげーって思いました

Cloudflare PagesやGithub Pagesみたいな静的なホスティングサービスでも動かせるのがすごく良いと思います

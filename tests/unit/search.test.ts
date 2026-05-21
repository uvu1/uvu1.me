import { describe, expect, test } from "vitest";
import type { Article } from "../../src/lib/articles";
import { parseQuery, searchArticles } from "../../src/lib/search";

function createArticle(partial: Partial<Article>): Article {
  return {
    slug: partial.slug ?? "test",
    title: partial.title ?? "Test Article",
    description: partial.description ?? "",
    date: partial.date ?? "2026-01-01",
    tags: partial.tags ?? [],
    pin: partial.pin ?? false,
    thumbnail: partial.thumbnail ?? "/article-thumbs/test.png",
    body: partial.body ?? "",
    html: partial.html ?? "",
    toc: partial.toc ?? [],
    readingTime: partial.readingTime ?? 1,
  };
}

describe("parseQuery", () => {
  test("plain keywordをparseできる", () => {
    expect(parseQuery("TanStack Markdown")).toEqual({
      textQuery: "TanStack Markdown",
      words: ["tanstack", "markdown"],
      tagFilters: [],
    });
  });

  test("{tag: name} をparseできる", () => {
    expect(parseQuery("Markdown {tag: UI}")).toEqual({
      textQuery: "Markdown",
      words: ["markdown"],
      tagFilters: ["UI"],
    });
  });

  test("tag only queryをparseできる", () => {
    expect(parseQuery("{tag: Web}")).toEqual({
      textQuery: "",
      words: [],
      tagFilters: ["Web"],
    });
  });
});

describe("searchArticles", () => {
  test("空queryでは結果を返さない", () => {
    const results = searchArticles(
      [
        createArticle({
          title: "Hello",
        }),
      ],
      "",
    );

    expect(results).toHaveLength(0);
  });

  test("titleで検索できる", () => {
    const results = searchArticles(
      [
        createArticle({
          slug: "a",
          title: "TanStack Start",
        }),
        createArticle({
          slug: "b",
          title: "Neovim Config",
        }),
      ],
      "tanstack",
    );

    expect(results.map((result) => result.article.slug)).toEqual(["a"]);
  });

  test("tagで絞り込める", () => {
    const results = searchArticles(
      [
        createArticle({
          slug: "web",
          tags: ["Web"],
        }),
        createArticle({
          slug: "infra",
          tags: ["Infra"],
        }),
      ],
      "{tag: Web}",
    );

    expect(results.map((result) => result.article.slug)).toEqual(["web"]);
  });

  test("同じscoreならdateが新しい記事を優先する", () => {
    const results = searchArticles(
      [
        createArticle({
          slug: "old",
          title: "Markdown",
          date: "2024-01-01",
        }),
        createArticle({
          slug: "new",
          title: "Markdown",
          date: "2026-01-01",
        }),
      ],
      "markdown",
    );

    expect(results.map((result) => result.article.slug)).toEqual([
      "new",
      "old",
    ]);
  });

  test("複数keywordはAND検索になる", () => {
    const results = searchArticles(
      [
        createArticle({
          slug: "match",
          title: "TanStack Markdown",
          body: "Search article",
        }),
        createArticle({
          slug: "miss",
          title: "TanStack",
          body: "No matching word",
        }),
      ],
      "tanstack markdown",
    );

    expect(results.map((result) => result.article.slug)).toEqual(["match"]);
  });
});

test("tag filterは複数指定できる", () => {
  const results = searchArticles(
    [
      createArticle({
        slug: "both",
        tags: ["UI", "Web"],
      }),
      createArticle({
        slug: "ui-only",
        tags: ["UI"],
      }),
    ],
    "{tag: UI} {tag: Web}",
  );

  expect(results.map((result) => result.article.slug)).toEqual(["both"]);
});

test("title matchはbody matchより優先される", () => {
  const results = searchArticles(
    [
      createArticle({
        slug: "body",
        title: "Other",
        body: "TanStack",
      }),
      createArticle({
        slug: "title",
        title: "TanStack",
        body: "",
      }),
    ],
    "tanstack",
  );

  expect(results.map((result) => result.article.slug)).toEqual([
    "title",
    "body",
  ]);
});


import { articles } from "../generated/articles";

export type { Article } from "../generated/articles";

export function getAllArticles() {
  return articles;
}

export function getPinnedArticles() {
  return articles.filter((article) => article.pin);
}

export function getArchiveArticles() {
  return articles;
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByTag(tag: string) {
  return articles.filter((article) => article.tags.includes(tag));
}

export function getAdjacentArticles(slug: string) {
  const index = articles.findIndex((article) => article.slug === slug);

  if (index === -1) {
    return {
      newerArticle: undefined,
      olderArticle: undefined,
    };
  }

  return {
    newerArticle: articles[index - 1],
    olderArticle: articles[index + 1],
  };
}

export function getAllTags() {
  const tagCounts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name, "ja");
    });
}

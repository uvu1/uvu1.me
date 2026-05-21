import type { Article } from "./articles";

export type ParsedSearchQuery = {
  textQuery: string;
  words: string[];
  tagFilters: string[];
};

export type ArticleSearchResult = {
  article: Article;
  score: number;
};

export function normalizeText(text: string) {
  return text.toLowerCase().normalize("NFKC").trim();
}

export function tokenize(text: string) {
  return normalizeText(text).split(/\s+/).filter(Boolean);
}

function toTime(date: string) {
  return new Date(date).getTime();
}

export function parseQuery(query: string): ParsedSearchQuery {
  const tagFilters: string[] = [];

  const textQuery = query
    .replace(/\{tag:\s*([^}]+)\}/gi, (_, tag: string) => {
      const normalizedTag = tag.trim();

      if (normalizedTag) {
        tagFilters.push(normalizedTag);
      }

      return " ";
    })
    .trim();

  return {
    textQuery,
    words: tokenize(textQuery),
    tagFilters,
  };
}

export function articleMatchesTags(article: Article, tagFilters: string[]) {
  if (tagFilters.length === 0) {
    return true;
  }

  const articleTags = article.tags.map(normalizeText);

  return tagFilters.every((tag) => {
    const normalizedTag = normalizeText(tag);
    return articleTags.includes(normalizedTag);
  });
}

export function scoreArticle(article: Article, parsed: ParsedSearchQuery) {
  const { words, tagFilters } = parsed;

  if (!articleMatchesTags(article, tagFilters)) {
    return 0;
  }

  if (words.length === 0) {
    return tagFilters.length > 0 ? 1 : 0;
  }

  const title = normalizeText(article.title);
  const description = normalizeText(article.description);
  const tags = normalizeText(article.tags.join(" "));
  const body = normalizeText(article.body);

  let score = 0;

  for (const word of words) {
    let matched = false;

    if (title.includes(word)) {
      score += title === word ? 120 : title.startsWith(word) ? 90 : 70;
      matched = true;
    }

    if (article.tags.some((tag) => normalizeText(tag) === word)) {
      score += 85;
      matched = true;
    } else if (tags.includes(word)) {
      score += 55;
      matched = true;
    }

    if (description.includes(word)) {
      score += 35;
      matched = true;
    }

    if (body.includes(word)) {
      score += 12;
      matched = true;
    }

    if (!matched) {
      return 0;
    }
  }

  if (words.length >= 2 && title.includes(words.join(" "))) {
    score += 40;
  }

  if (tagFilters.length > 0) {
    score += tagFilters.length * 20;
  }

  return score;
}

export function searchArticles(
  articles: Article[],
  query: string,
): ArticleSearchResult[] {
  const parsed = parseQuery(query);

  if (parsed.words.length === 0 && parsed.tagFilters.length === 0) {
    return [];
  }

  return articles
    .map((article) => ({
      article,
      score: scoreArticle(article, parsed),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return toTime(b.article.date) - toTime(a.article.date);
    });
}

export function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

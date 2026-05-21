import matter from "gray-matter";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  pin: boolean;
  thumbnail: string;
  body: string;
};

type RawFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  pin?: boolean;
};

const markdownFiles = import.meta.glob("../content/articles/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

function getSlug(path: string) {
  return path.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? "";
}

function parseArticle(path: string, raw: string): Article {
  const { data, content } = matter(raw);
  const fm = data as RawFrontmatter;
  const slug = getSlug(path);

  return {
    slug,
    title: fm.title ?? "Untitled",
    description: fm.description ?? "",
    date: fm.date ?? "1970-01-01",
    tags: fm.tags ?? [],
    pin: fm.pin ?? false,
    thumbnail: `/article-thumbs/${slug}.png`,
    body: content,
  };
}

export function getAllArticles() {
  return Object.entries(markdownFiles)
    .map(([path, raw]) => parseArticle(path, raw as string))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPinnedArticles() {
  return getAllArticles().filter((article) => article.pin);
}

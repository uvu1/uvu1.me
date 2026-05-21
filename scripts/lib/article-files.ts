import { access, readdir } from "node:fs/promises";
import path from "node:path";

export type ArticleFile = {
  slug: string;
  filePath: string;
  articleDir: string;
};

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getArticleFiles(articlesDir: string): Promise<ArticleFile[]> {
  const entries = await readdir(articlesDir, { withFileTypes: true });
  const articleFiles: ArticleFile[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    if (entry.name.startsWith(".")) continue;

    const entryPath = path.join(articlesDir, entry.name);

    // legacy: src/content/articles/slug.md
    if (entry.isFile() && entry.name.endsWith(".md")) {
      const slug = entry.name.replace(/\.md$/, "");

      articleFiles.push({
        slug,
        filePath: entryPath,
        articleDir: articlesDir,
      });

      continue;
    }

    // recommended: src/content/articles/slug/index.md
    if (entry.isDirectory()) {
      const indexPath = path.join(entryPath, "index.md");

      if (!(await exists(indexPath))) continue;

      articleFiles.push({
        slug: entry.name,
        filePath: indexPath,
        articleDir: entryPath,
      });
    }
  }

  return articleFiles.sort((a, b) => a.slug.localeCompare(b.slug));
}

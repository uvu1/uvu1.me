import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { articles } from "../src/generated/articles";
import { getAllTags } from "../src/lib/articles";
import { siteConfig } from "../src/config/site";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "sitemap.xml");

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}

function toDateOnly(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

function renderUrl(entry: SitemapEntry) {
  return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${
      entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""
    }${
      entry.changefreq
        ? `\n    <changefreq>${entry.changefreq}</changefreq>`
        : ""
    }${
      typeof entry.priority === "number"
        ? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
        : ""
    }
  </url>`;
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const latestArticleDate =
    [...articles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0]?.date ?? new Date().toISOString();

  const staticPages: SitemapEntry[] = [
    {
      loc: absoluteUrl("/"),
      lastmod: toDateOnly(latestArticleDate),
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      loc: absoluteUrl("/articles"),
      lastmod: toDateOnly(latestArticleDate),
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: absoluteUrl("/projects"),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: absoluteUrl("/about"),
      changefreq: "monthly",
      priority: 0.6,
    },
  ];

  const articlePages: SitemapEntry[] = articles.map((article) => ({
    loc: absoluteUrl(`/articles/${article.slug}`),
    lastmod: toDateOnly(article.date),
    changefreq: "monthly",
    priority: 0.8,
  }));

  const tagPages: SitemapEntry[] = getAllTags().map((tag) => ({
    loc: absoluteUrl(`/tags/${encodeURIComponent(tag.name)}`),
    lastmod: toDateOnly(latestArticleDate),
    changefreq: "weekly",
    priority: 0.5,
  }));

  const entries = [...staticPages, ...articlePages, ...tagPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderUrl).join("\n")}
</urlset>
`;

  await writeFile(outputPath, sitemap, "utf-8");

  console.log(`Generated sitemap: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

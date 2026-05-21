import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { articles } from "../src/generated/articles";
import { siteConfig } from "../src/config/site";
import { absoluteUrl, escapeXml } from "./lib/xml";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "rss.xml");

function toRfc822(date: string) {
  return new Date(date).toUTCString();
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sortedArticles
    .map((article) => {
      const articleUrl = absoluteUrl(`/articles/${article.slug}`);
      const imageUrl = absoluteUrl(article.thumbnail);

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${toRfc822(article.date)}</pubDate>
      ${article.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("\n      ")}
      <enclosure url="${escapeXml(imageUrl)}" type="image/webp" />
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${escapeXml(siteConfig.language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>uvu1.me generator</generator>${items}
  </channel>
</rss>
`;

  await writeFile(outputPath, rss, "utf-8");

  console.log(`Generated RSS: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

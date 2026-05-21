import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const publicArticleAssetsDir = path.join(rootDir, "public/article-assets");

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function isExternalUrl(src: string) {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("//") ||
    src.startsWith("data:")
  );
}

function isRootRelativePath(src: string) {
  return src.startsWith("/");
}

function isLocalImage(src: string) {
  if (isExternalUrl(src)) return false;
  if (isRootRelativePath(src)) return false;

  const cleanSrc = src.split("#")[0]?.split("?")[0] ?? src;
  return imageExtensions.has(path.extname(cleanSrc).toLowerCase());
}

function toWebpFileName(src: string) {
  const cleanSrc = src.split("#")[0]?.split("?")[0] ?? src;
  const parsed = path.parse(cleanSrc);

  return `${parsed.name}.webp`;
}

async function replaceAsync(
  text: string,
  regex: RegExp,
  replacer: (match: RegExpMatchArray) => Promise<string>,
) {
  const matches = [...text.matchAll(regex)];

  if (matches.length === 0) return text;

  const replacements = await Promise.all(matches.map(replacer));

  let result = text;

  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const index = match.index ?? 0;

    result =
      result.slice(0, index) +
      replacements[i] +
      result.slice(index + match[0].length);
  }

  return result;
}

export async function processArticleImages({
  markdown,
  articleDir,
  slug,
}: {
  markdown: string;
  articleDir: string;
  slug: string;
}) {
  const outputDir = path.join(publicArticleAssetsDir, slug);
  await mkdir(outputDir, { recursive: true });

  // Standard Markdown image only:
  // ![alt](./assets/image.png)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;

  return replaceAsync(markdown, imagePattern, async (match) => {
    const alt = match[1] ?? "";
    const rawSrc = (match[2] ?? "").trim();

    if (!isLocalImage(rawSrc)) {
      return match[0];
    }

    const srcWithoutHash = rawSrc.split("#")[0] ?? rawSrc;
    const srcWithoutQuery = srcWithoutHash.split("?")[0] ?? srcWithoutHash;

    const decodedSrc = decodeURIComponent(srcWithoutQuery);
    const inputPath = path.resolve(articleDir, decodedSrc);

    const outputName = toWebpFileName(decodedSrc);
    const outputPath = path.join(outputDir, outputName);
    const publicPath = `/article-assets/${slug}/${outputName}`;

    await sharp(inputPath)
      .webp({
        quality: 82,
        effort: 6,
      })
      .toFile(outputPath);

    return `![${alt}](${publicPath})`;
  });
}

import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = process.cwd();

const CONTENT_DIR = path.join(ROOT, "src/content/articles");
const OUT_DIR = path.join(ROOT, "public/article-thumbs");

const BG_PATH = path.join(ROOT, "src/assets/background.png");
const FONT_REGULAR_PATH = path.join(
  ROOT,
  "src/assets/fonts/NotoSansJP-Regular.ttf",
);
const FONT_BOLD_PATH = path.join(
  ROOT,
  "src/assets/fonts/NotoSansJP-Bold.ttf",
);

type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  pin?: boolean;
  draft?: boolean;
};

type GeneratedArticle = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  pin: boolean;
  thumbnail: string;
  body: string;
};

const articles: GeneratedArticle[] = [];

function slugFromFileName(fileName: string) {
  return fileName.replace(/\.(md|mdx)$/, "");
}

function formatDate(date?: string) {
  return date ? date.replaceAll("-", "/") : "";
}

function normalizeTags(tags?: string[]) {
  return [...new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
}

function splitTitle(title: string, maxCharsPerLine = 18) {
  const text = title.trim();
  const lines: string[] = [];
  let rest = text;

  while (rest.length > maxCharsPerLine && lines.length < 2) {
    lines.push(rest.slice(0, maxCharsPerLine));
    rest = rest.slice(maxCharsPerLine);
  }

  lines.push(rest);
  return lines.slice(0, 3);
}

async function toDataUrl(filePath: string, mimeType: string) {
  const buffer = await fs.readFile(filePath);
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function ensureCleanOutDir() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
}

async function main() {
  const backgroundDataUrl = await toDataUrl(BG_PATH, "image/png");
  const regularFont = await fs.readFile(FONT_REGULAR_PATH);
  const boldFont = await fs.readFile(FONT_BOLD_PATH);

  const fileNames = await fs.readdir(CONTENT_DIR);
  const articleFiles = fileNames.filter((name) => /\.(md|mdx)$/.test(name));

  await ensureCleanOutDir();

  for (const fileName of articleFiles) {
    const slug = slugFromFileName(fileName);
    const filePath = path.join(CONTENT_DIR, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as Frontmatter;

    if (fm.draft) continue;

    const title = fm.title ?? slug;
    const date = formatDate(fm.date);
    const tags = normalizeTags(fm.tags);
    const titleLines = splitTitle(title);

    const svg = await satori(
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          borderRadius: "32px",
          fontFamily: "NotoSansJP",
        }}
      >
        <img
          src={backgroundDataUrl}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: "0",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.22) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "1px solid rgba(191,217,247,0.95)",
                background: "rgba(255,255,255,0.74)",
                color: "#7AAEE0",
                fontSize: "28px",
                fontWeight: 600,
              }}
            >
              uvu1.me
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "780px",
            }}
          >
            {titleLines.map((line, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  color: "#5B79A8",
                  fontSize: "68px",
                  lineHeight: 1.18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  textShadow: "0 6px 24px rgba(255,255,255,0.28)",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex", 
                    padding: "10px 18px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(191,217,247,0.95)",
                    background: "rgba(255,255,255,0.74)",
                    color: "#7AAEE0",
                    fontSize: "24px",
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "1px solid rgba(191,217,247,0.95)",
                background: "rgba(255,255,255,0.74)",
                color: "#7A8AA0",
                fontSize: "24px",
              }}
            >
              {date}
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "NotoSansJP",
            data: regularFont,
            weight: 400,
            style: "normal",
          },
          {
            name: "NotoSansJP",
            data: boldFont,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );

    const png = new Resvg(svg).render().asPng();
    const outputPath = path.join(OUT_DIR, `${slug}.png`);

    await fs.writeFile(outputPath, png);
    console.log(`generated: ${path.relative(ROOT, outputPath)}`);

    articles.push({
      slug,
      title,
      description: fm.description ?? "",
      date: fm.date ?? "",
      tags,
      pin: fm.pin ?? false,
      thumbnail: `/article-thumbs/${slug}.png`,
      body: content,
    })
  }
  articles.sort((a, b) => b.date.localeCompare(a.date));

  const generatedPath = path.join(ROOT, "src/generated/articles.ts");
  const generatedCode = ` // This file is auto-generated by scripts/generate-thumbnails.tsx
  // Do not edit manually.

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

  export const articles: Article[] = ${JSON.stringify(articles, null, 2)} as const;
  `

  await fs.mkdir(path.dirname(generatedPath), { recursive: true });
  await fs.writeFile(generatedPath, generatedCode);
  console.log("generated: src/generated/articles.ts");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

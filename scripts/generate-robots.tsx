import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "../src/config/site";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "robots.txt");

async function main() {
  await mkdir(publicDir, { recursive: true });

  const robots = `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", siteConfig.url).toString()}
`;

  await writeFile(outputPath, robots, "utf-8");

  console.log(`Generated robots.txt: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

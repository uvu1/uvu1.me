import { promises as fs } from "node:fs";

export async function toDataUrl(filePath: string, mimeType: string) {
  const buffer = await fs.readFile(filePath);
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export async function ensureCleanDir(dirPath: string) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const rootDir = process.cwd()
const faviconDir = path.join(rootDir, 'public/favicons')
const sourcePath = path.join(faviconDir, 'source.png')

async function main() {
  await mkdir(faviconDir, { recursive: true })

  await sharp(sourcePath)
    .resize(32, 32)
    .png()
    .toFile(path.join(faviconDir, 'favicon-32.png'))

  await sharp(sourcePath)
    .resize(192, 192)
    .png()
    .toFile(path.join(faviconDir, 'favicon-192.png'))

  await sharp(sourcePath)
    .resize(512, 512)
    .png()
    .toFile(path.join(faviconDir, 'favicon-512.png'))

  await sharp(sourcePath)
    .resize(180, 180)
    .png()
    .toFile(path.join(faviconDir, 'apple-touch-icon.png'))

  console.log('Generated favicons')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

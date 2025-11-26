// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from "url";
import path, { dirname } from 'path';

import sitemap from "@astrojs/sitemap";

import robots from "astro-robots";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName)

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), robots()],
  site: "https://uvu1.me",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  vite: {
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirName, "src")}`
      }
    }
  }
});
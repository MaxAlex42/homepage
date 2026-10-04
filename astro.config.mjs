// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { unified } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: "https://maxalex42.net",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  i18n: {
    locales: ["at", "en"],
    defaultLocale: "en"
  },
  integrations: [react()],
  trailingSlash: "never",
});

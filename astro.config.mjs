// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://fisiocorb.cat",
  trailingSlash: "always",
  build: { format: "directory" },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
      i18n: { defaultLocale: "ca", locales: { ca: "ca-ES", es: "es-ES" } },
    }),
  ],
});

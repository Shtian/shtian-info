// @ts-check

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Pages stay prerendered; only routes with `prerender = false` run on Vercel.
  adapter: vercel(),

  env: {
    schema: {
      POSTHOG_PROJECT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      POSTHOG_PERSONAL_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});

import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    printWidth: 80,
    trailingComma: "es5",
    sortImports: {},
    ignorePatterns: [".claude/skills/**", "src/styles/global.css"],
  },
  lint: {
    ignorePatterns: [".claude/skills/**", "src/components/PostHog.astro"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});

// 1. Import utilities and loader(s)
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

// 2. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: "src/projects/*.md" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      date: z.date(),
      link: z.url(),
      cover: image(),
    }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = { projects };

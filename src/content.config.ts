// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { file, glob } from "astro/loaders";

// 3. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: "projects/*.md" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.date(),
    link: z.string().url(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { projects };

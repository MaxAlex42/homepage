import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/blog",
  }),

  schema: z.object({
    title: z.string(),
    abstract: z.string(),
    published: z.coerce.date(),

    tags: z
      .array(z.string())
      .default([]),

    series: z
      .object({
        id: z.string(),
        order: z.number().int().positive(),
      })
      .optional(),

    draft: z
      .boolean()
      .default(false),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/projects",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),

    technologies: z.array(z.string()).default([]),

    status: z.enum([
      "active",
      "finished",
      "experimental",
      "archived",
    ]),

    year: z.number(),

    featured: z.boolean().default(false),

    repository: z.string().optional(),
    website: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  projects,
};
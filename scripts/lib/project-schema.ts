import { z } from "zod";

export const ProjectStatusSchema = z.enum([
  "running",
  "planning",
  "archived",
]);

export const ProjectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  category: z.string().min(1).default("other"),
  status: ProjectStatusSchema.catch("running").default("running"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  stack: z.array(z.string().min(1)).default([]),
  repo: z.string().url().optional(),
  link: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

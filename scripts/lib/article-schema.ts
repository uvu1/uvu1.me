import { z } from 'zod'

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  tags: z.array(z.string().min(1)).default([]),
  pin: z.boolean().default(false),
  draft: z.boolean().default(false),
})

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>

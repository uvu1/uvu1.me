import { z } from 'zod'

const DateStringSchema = z.preprocess(
  (value) => {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10)
    }

    return value
  },
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
)

export const ArticleFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().default(''),
    date: DateStringSchema,
    tags: z.preprocess((v) => (v == null ? [] : v), z.array(z.string())),
    pin: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .superRefine((value, ctx) => {
    if (value.draft) return
    value.tags.forEach((tag, index) => {
      if (tag === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['tags', index],
          message: 'tag must not be empty',
        })
      }
    })
  })

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>

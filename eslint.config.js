//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: [
      "src/generated/**",
      "public/article-thumbs/**",
      "public/article-assets/**",
      "dist/**",
      ".output/**",
      ".wrangler/**",
      ".vinxi/**",

      "src/content/articles/**",
      "eslint.config.js",
    ],
  },
]

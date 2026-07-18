import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'
import { visit } from 'unist-util-visit'
import type { TocItem } from './article-types'

function extractText(node: any): string {
  if (!node) return ''

  if (node.type === 'text') {
    return node.value ?? ''
  }

  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join('')
  }

  return ''
}

function extractCodeText(node: any): string {
  if (!node) return ''

  if (node.type === 'text') {
    return node.value ?? ''
  }

  if (Array.isArray(node.children)) {
    return node.children.map(extractCodeText).join('')
  }

  return ''
}

function collectToc(toc: TocItem[]) {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'h1') return

      const id = node.properties?.id
      const text = extractText(node)

      if (!id || !text) return

      toc.push({
        id: String(id),
        text,
        depth: 1,
      })
    })
  }
}

const CALLOUT_MARKER = /^\[!([a-zA-Z0-9-]+)\]([-+])[ \t]*/

function transformFoldableCallouts() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'blockquote') return

      const children: any[] = node.children ?? []
      const paragraphIndex = children.findIndex(
        (child: any) => child.type === 'element',
      )
      const paragraph = children[paragraphIndex]

      if (!paragraph || paragraph.tagName !== 'p') return

      const [lead, ...inline] = paragraph.children ?? []

      if (lead?.type !== 'text') return

      const match = lead.value.match(CALLOUT_MARKER)

      if (!match) return

      const [marker, type, fold] = match
      const breakIndex = inline.findIndex(
        (child: any) => child.type === 'element' && child.tagName === 'br',
      )
      const titleLead = lead.value.slice(marker.length)
      const titleRest = breakIndex === -1 ? inline : inline.slice(0, breakIndex)
      const bodyInline = breakIndex === -1 ? [] : inline.slice(breakIndex + 1)

      if (bodyInline[0]?.type === 'text') {
        bodyInline[0].value = bodyInline[0].value.replace(/^\n/, '')
      }

      const titleChildren =
        titleLead.trim() || titleRest.length > 0
          ? [{ type: 'text', value: titleLead }, ...titleRest]
          : [
              {
                type: 'text',
                value: type.charAt(0).toUpperCase() + type.slice(1),
              },
            ]

      node.tagName = 'details'
      node.properties = {
        ...(node.properties ?? {}),
        className: ['callout'],
        dataCallout: type.toLowerCase(),
      }

      if (fold === '+') {
        node.properties.open = true
      }

      node.children = [
        {
          type: 'element',
          tagName: 'summary',
          properties: {},
          children: titleChildren,
        },
        ...(bodyInline.length > 0
          ? [
              {
                type: 'element',
                tagName: 'p',
                properties: {},
                children: bodyInline,
              },
            ]
          : []),
        ...children.slice(paragraphIndex + 1),
      ]
    })
  }
}

function addCodeBlockMeta() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (
        node.tagName !== 'figure' ||
        !node.properties ||
        !('data-rehype-pretty-code-figure' in node.properties)
      ) {
        return
      }

      const pre = node.children?.find((child: any) => child.tagName === 'pre')
      const code = pre?.children?.find((child: any) => child.tagName === 'code')

      if (!pre || !code) return

      const rawCode = extractCodeText(code).replace(/\n$/, '')
      const lineCount = rawCode.length === 0 ? 1 : rawCode.split('\n').length
      const language =
        code.properties?.['data-language'] ||
        code.properties?.dataLanguage ||
        'text'

      code.properties = {
        ...(code.properties ?? {}),
        'data-line-numbers': '',
        'data-line-numbers-max-digits': String(String(lineCount).length),
      }

      node.properties.className = [
        ...(node.properties.className ?? []),
        'code-block',
      ]

      node.children = node.children.filter(
        (child: any) =>
          !(
            child.tagName === 'figcaption' &&
            child.properties &&
            'data-rehype-pretty-code-title' in child.properties
          ),
      )

      node.children.unshift({
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['code-block-header'],
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['code-block-language'],
            },
            children: [{ type: 'text', value: String(language) }],
          },
          {
            type: 'element',
            tagName: 'button',
            properties: {
              type: 'button',
              className: ['code-copy-button'],
              'data-code': rawCode,
              'aria-label': 'コードをコピー',
            },
            children: [{ type: 'text', value: 'Copy' }],
          },
        ],
      })
    })
  }
}

export async function markdownToHtml(markdown: string) {
  const toc: TocItem[] = []

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeSanitize)
    .use(() => collectToc(toc))
    .use(transformFoldableCallouts)
    .use(rehypePrettyCode, {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      keepBackground: false,
    })
    .use(addCodeBlockMeta)
    .use(rehypeStringify)
    .process(markdown)

  return {
    html: String(file),
    toc,
  }
}

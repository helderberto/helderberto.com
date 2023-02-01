import fs from 'fs'
import matter from 'gray-matter'
import { visit } from 'unist-util-visit'
import path from 'path'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'

import MDXComponents from '@/components/MDXComponents'

// Remark plugins
import remarkImgToJsx from './remark-img-to-jsx'
import remarkSlug from 'remark-slug'
import remarkAutolinkHeadings from 'remark-autolink-headings'
import remarkCodeTitles from 'remark-code-titles'

// Rehype plugins
import rehypeKatex from 'rehype-katex'
import rehypePrism from '@mapbox/rehype-prism'

const root = process.cwd()

const tokenClassNames = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-400 italic',
}

export async function getFiles(type) {
  return fs.readdirSync(path.join(root, 'data', type))
}

export function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFileBySlug(type, slug) {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const isMdx = fs.existsSync(mdxPath)
  const source = isMdx ? fs.readFileSync(mdxPath, 'utf8') : fs.readFileSync(mdPath, 'utf8')

  const { data, content } = matter(source)
  let mdxSource

  if (isMdx) {
    mdxSource = await serialize(content)
  } else {
    mdxSource = await serialize(content, {
      components: MDXComponents,
      mdxOptions: {
        remarkPlugins: [remarkSlug, remarkAutolinkHeadings, remarkCodeTitles, remarkImgToJsx],
        inlineNotes: true,
        rehypePlugins: [
          rehypeKatex,
          rehypePrism,
          () => {
            return (tree) => {
              visit(tree, 'element', (node, index, parent) => {
                let [token, type] = node.properties.className || []
                if (token === 'token') {
                  node.properties.className = [tokenClassNames[type]]
                }
              })
            }
          },
        ],
      },
    })
  }

  return {
    mdxSource,
    isMdx,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...data,
    },
  }
}

export async function getAllFilesFrontMatter(type) {
  const files = fs.readdirSync(path.join(root, 'data', type))

  const allFrontMatter = []

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
    const { data } = matter(source)
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(file) })
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}

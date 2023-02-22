import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'

const root = process.cwd()

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

  const mdxSource = await serialize(content)

  return {
    mdxSource,
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

import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { useState } from 'react'

const postDateTemplate = { year: 'numeric', month: 'long', day: 'numeric' }

export default function ListLayout({ posts, title }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter(({ title, summary, tags }) => {
    const searchContent = title + summary + tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  return (
    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        {title}
      </h1>
      <div className="relative">
        <input
          aria-label="Search articles"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search articles"
          className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
        <svg
          className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <ul className="pt-4">
        {!filteredBlogPosts.length && 'No posts found.'}
        {filteredBlogPosts.map((frontMatter) => {
          const { slug, date, title, summary, tags } = frontMatter
          return (
            <li key={slug} className="py-4">
              <article>
                <div className="space-y-2">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-500">
                      <time dateTime={date}>
                        {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                      </time>
                    </dd>
                  </dl>
                  <h3 className="text-2xl font-bold leading-8 tracking-tight">
                    <Link
                      href={`/${slug}`}
                      className="text-gray-900 dark:text-gray-100 dark:hover:text-pink-600 hover:text-pink-600"
                    >
                      {title}
                    </Link>
                  </h3>
                  <div className="prose max-w-none dark:text-gray-400">{summary}</div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

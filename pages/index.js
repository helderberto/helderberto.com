import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'

import ListLayout from '@/layouts/ListLayout'

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSeo title="Home" description={siteMetadata.description} url={siteMetadata.siteUrl} />
      <p className="text-lg leading-7 mb-6 text-gray-500 dark:text-gray-400">
        Hey there 👋! Welcome to my digital garden 🌱
      </p>
      <p className="text-lg leading-7 text-gray-500 dark:text-gray-400 ">
        The goal of this page is to share my thoughts on programming and contribute to the
        development community that helped me become the person I am today.
      </p>
      <ListLayout posts={posts} />
    </>
  )
}

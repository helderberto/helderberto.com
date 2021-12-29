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
      <p className="text-lg leading-7 text-gray-500 dark:text-gray-400 ">
        Hey! I'm{' '}
        <a
          href="https://twitter.com/helderburato"
          className="text-green-500 hover:text-green-600 dark:hover:text-green-400"
        >
          Helder Burato Berto
        </a>
        . A Brazilian Front End Developer living in Porto, Portugal.
      </p>
      <ListLayout posts={posts} />
    </>
  )
}

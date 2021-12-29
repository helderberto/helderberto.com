import Link from 'next/link'
import { kebabCase } from '@/lib/utils'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 text-sm font-medium text-green-500 uppercase hover:text-green-600 dark:hover:text-green-400">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag

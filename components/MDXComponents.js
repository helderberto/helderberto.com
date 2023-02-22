import Image from 'next/image'
import CustomLink from './Link'
import dynamic from 'next/dynamic'

const MDXComponents = {
  Image,
  a: CustomLink,
  SandpackEditor: dynamic(() => import('./SandpackEditor')),
}

export default MDXComponents

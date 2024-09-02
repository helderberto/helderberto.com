import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { PageSeo } from '@/components/SEO'
import Image from 'next/image'

export default function About() {
  return (
    <>
      <PageSeo
        title="About"
        description={`About - ${siteMetadata.author}`}
        url={`${siteMetadata.siteUrl}/about`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2">
          <div className="flex flex-col items-center pt-8 space-x-2">
            <Image
              src={siteMetadata.image}
              alt="avatar"
              height="200"
              width="200"
              className="w-48 h-48 rounded-full"
            />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {siteMetadata.author}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">Software Engineer — Front-End</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
              <SocialIcon kind="github" href={siteMetadata.github} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
            </div>
          </div>
          <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
            <p>
              I'm a Software Engineer for over 13 years, collaborating with agencies, consulting
              firms, start-ups, and product platforms.
            </p>
            <p>
              Currently, I'm a Senior Software Engineer — Front-End at{' '}
              <a href="https://www.pagerduty.com/" target="_blank" rel="noreferrer">
                PagerDuty
              </a>{' '}
              , where my main focus lies in enhancing and creating user interfaces for our
              customers.
            </p>
            <p>
              I'm an expert in front-end development, backed by extensive experience in back-end
              development.
            </p>
            <p>
              Throughout my career, I have successfully led various software projects, while also
              taking on responsibilities such as mentoring and hiring talented software engineers.
            </p>
            <p>
              Over the past five years, I have extensively utilized the following tools: TypeScript,
              JavaScript, React, Jest, React Testing Library, and Node.js.
            </p>
            <p>
              While technologies constantly evolve, I firmly believe that certain fundamental
              concepts remain timeless, and it is these principles that hold the utmost importance
              to me.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

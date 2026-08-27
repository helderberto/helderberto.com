import { siteConfig } from '@/config/site';
import { detailedExperience, earlierExperience, resume } from '@/data/resume';
import { PrintButton } from './PrintButton';
import styles from './resume.module.css';

export default function Resume() {
  return (
    <div className="rs-root">
      <div className="rs-toolbar rs-no-print">
        <a href={siteConfig.url} className="rs-button rs-button--ghost">
          ← helderberto.com
        </a>
        <PrintButton />
      </div>

      <article className="rs-sheet" lang="en">
        <header className={styles.masthead}>
          <div>
            <h1 className={styles.name}>{resume.name}</h1>
            <p className={styles.headline}>{resume.headline}</p>
          </div>
          <address className={styles.contact}>
            <span>{resume.location}</span>
            <span className="rs-print-only">{resume.phone}</span>
            <a href={`mailto:${resume.email}`}>
              <strong>{resume.email}</strong>
            </a>
            {resume.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </address>
        </header>

        <h2 className={styles.summaryTitle}>Summary</h2>
        <p className={styles.summary}>{resume.summary}</p>

        <div className={styles.body}>
          <div>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {detailedExperience.map((job) => (
                <article
                  key={`${job.company}-${job.period}`}
                  className={`${styles.job} rs-avoid-break`}
                >
                  {job.positions.length > 0 ? (
                    job.positions.map((position) => (
                      <div
                        key={position.level}
                        className={styles.positionBlock}
                      >
                        <h3 className={styles.jobTitle}>{position.level}</h3>
                        <p className={styles.jobMeta}>
                          {job.company} · {job.location} · {position.period}
                        </p>
                        <ul className={styles.bullets}>
                          {position.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <>
                      <h3 className={styles.jobTitle}>{job.role}</h3>
                      <p className={styles.jobMeta}>
                        {job.company} · {job.location} · {job.period}
                      </p>
                      <ul className={styles.bullets}>
                        {job.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {job.tech.length > 0 && (
                    <p className={styles.tech}>{job.tech.join(' · ')}</p>
                  )}
                </article>
              ))}

              <div className={styles.earlier}>
                {earlierExperience.map((job) => (
                  <p
                    key={`${job.company}-${job.period}`}
                    className={styles.earlierRow}
                  >
                    <span>
                      <strong>{job.role}</strong>, {job.company} ·{' '}
                      {job.location}
                    </span>
                    <span>{job.period}</span>
                  </p>
                ))}
              </div>
            </section>
          </div>

          <div>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <dl>
                {resume.skills.map((skill) => (
                  <div key={skill.group} className={styles.skillGroup}>
                    <dt>{skill.group}</dt>
                    <dd>{skill.items.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={styles.section}>
              <p className={styles.footnote}>
                <strong>Languages</strong>{' '}
                {resume.languages
                  .map((language) => `${language.name} (${language.level})`)
                  .join(' · ')}
              </p>
              <p className={styles.footnote}>
                <strong>Education</strong>{' '}
                {resume.education
                  .map(
                    (item) =>
                      `${item.program}, ${item.school}, ${item.location} (${item.period})`,
                  )
                  .join(' · ')}
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}

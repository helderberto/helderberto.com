import { siteConfig } from '@/config/site';
import { detailedExperience, earlierExperience, resume } from '@/data/resume';
import { PrintButton } from './PrintButton';
import styles from './resume.module.css';

export default function Resume() {
  return (
    <div className="rs-root">
      <div className="rs-toolbar rs-no-print">
        <a href={siteConfig.homeUrl} className="rs-button rs-button--ghost">
          ← helderberto.com
        </a>
        <PrintButton />
      </div>

      <article className="rs-sheet" lang="en">
        <header className={styles.masthead}>
          <h1 className={styles.name}>{resume.name}</h1>
          <p className={styles.headline}>{resume.headline}</p>
          <address className={styles.contact}>
            <span>{resume.location}</span>
            <span className="rs-print-only"> · {resume.phone}</span>
            <span>
              {' · '}
              <a href={`mailto:${resume.email}`}>
                <strong>{resume.email}</strong>
              </a>
            </span>
            {resume.links.map((link) => (
              <span key={link.href}>
                {' · '}
                <a href={link.href}>{link.label}</a>
              </span>
            ))}
          </address>
        </header>

        <h2 className={styles.summaryTitle}>Summary</h2>
        <p className={styles.summary}>{resume.summary}</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          {resume.skills.map((skill) => (
            <p key={skill.group} className={styles.skillRow}>
              <strong>{skill.group}:</strong> {skill.items.join(', ')}
            </p>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {detailedExperience.map((job) => (
            <article
              key={`${job.company}-${job.period}`}
              className={`${styles.job} rs-avoid-break`}
            >
              {job.positions.length > 0 ? (
                job.positions.map((position) => (
                  <div key={position.level} className={styles.positionBlock}>
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
                <strong>{job.role}</strong>, {job.company} · {job.location} ·{' '}
                {job.period}
              </p>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {resume.education.map((item) => (
            <p key={item.school} className={styles.inlineRow}>
              {item.program}, {item.school}, {item.location} ({item.period})
            </p>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Languages</h2>
          <p className={styles.inlineRow}>
            {resume.languages
              .map((language) => `${language.name} (${language.level})`)
              .join(' · ')}
          </p>
        </section>
      </article>
    </div>
  );
}

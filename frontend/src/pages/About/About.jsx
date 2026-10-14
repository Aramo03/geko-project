import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import TeamMemberCard from '../../components/TeamMemberCard/TeamMemberCard.jsx'
import { ABOUT_VALUES, REFERENCE_INSTRUCTORS, teamListFromResponse } from './about.js'
import './about.css'

function SectionHeading({ eyebrow, title, text }) {
  const { t } = useTranslation()
  return (
    <header className="about-section-heading">
      <span className="about-eyebrow">{t(eyebrow)}</span>
      <h2>{t(title)}</h2>
      <p>{t(text)}</p>
    </header>
  )
}

function AboutIcon({ type }) {
  const paths = {
    mission: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
    vision: <><path d="M20.8 4.8c-7.7-.8-13 2.6-13 8.1a6.3 6.3 0 0 0 6.3 6.3c5.5 0 8.9-5.3 8.1-13l-1.4-1.4Z" /><path d="m8 16 8-8" /></>,
    teachers: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3a4.5 4.5 0 0 1 4.5 4.5V20M17 11l2 2 4-4" /></>,
    learning: <><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23V5.5Zm18 0A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23V5.5Z" /></>,
    tech: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h6v6H9zM9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3" /></>,
    programs: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18m-9 3v4m-2-2h4" /></>,
  }
  return <span className="about-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg></span>
}

function ReferenceInstructorCard({ instructor }) {
  const { t } = useTranslation()
  return (
    <article className="about-reference-card">
      <div className="about-reference-card__portrait" aria-hidden="true" />
      <div className="about-reference-card__content">
        <h3>{t(`about.instructors.${instructor}.name`)}</h3>
        <p className="about-reference-card__role">{t(`about.instructors.${instructor}.role`)}</p>
        <p>{t(`about.instructors.${instructor}.description`)}</p>
      </div>
    </article>
  )
}

export default function About() {
  const { t, i18n } = useTranslation()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    api.get('/api/teams/')
      .then((res) => { if (active) setTeams(teamListFromResponse(res.data)) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [i18n.language])

  return (
    <main className="about-page">
      <section className="about-banner" aria-labelledby="about-page-title">
        <div className="about-banner__inner">
          <h1 id="about-page-title">{t('about.pageTitle')}</h1>
          <nav className="about-breadcrumb" aria-label={t('about.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link><span aria-hidden="true">›</span><span>{t('nav.about')}</span>
          </nav>
        </div>
      </section>

      <section className="about-story about-container">
        <img className="about-story__image" src="/images/mer_masin.webp" alt={t('about.storyImageAlt')} />
        <div className="about-story__copy">
          <span className="about-eyebrow">{t('about.storyEyebrow')}</span>
          <h2>{t('about.storyTitle')}</h2>
          <p>{t('about.storyText1')}</p>
          <p>{t('about.storyText2')}</p>
          <Link className="about-button" to="/course-category">{t('about.learnMore')} <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-container">
          <SectionHeading eyebrow="about.missionEyebrow" title="about.missionHeading" text="about.missionIntro" />
          <div className="about-mission__grid">
            {['mission', 'vision'].map((type) => (
              <article className="about-mission-card" key={type}>
                <AboutIcon type={type} />
                <h3>{t(`about.${type}Title`)}</h3>
                <p>{t(`about.${type}Text`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values about-container">
        <SectionHeading eyebrow="about.valuesEyebrow" title="about.valuesTitle" text="about.valuesIntro" />
        <div className="about-values__grid">
          {ABOUT_VALUES.map(({ key, icon }) => (
            <article className="about-value-card" key={key}>
              <AboutIcon type={icon} />
              <h3>{t(`about.values.${key}.title`)}</h3>
              <p>{t(`about.values.${key}.text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-stats" aria-label={t('about.statsTitle')}>
        <div className="about-container about-stats__grid">
          {['students', 'courses', 'educators', 'trust'].map((key) => (
            <div className="about-stat" key={key}><strong>{t(`about.stats.${key}.number`)}</strong><span>{t(`about.stats.${key}.label`)}</span></div>
          ))}
        </div>
      </section>

      <section className="about-team-section">
        <div className="about-container">
          <SectionHeading eyebrow="about.teamEyebrow" title="about.team" text="about.teamIntro" />
          <div className="about-team" aria-busy={loading}>
            {loading && <p className="about-state">{t('common.loading')}</p>}
            {error && <div className="about-team-grid">{REFERENCE_INSTRUCTORS.map((instructor) => <ReferenceInstructorCard key={instructor} instructor={instructor} />)}</div>}
            {!loading && !error && teams.length === 0 && <p className="about-state">{t('about.empty')}</p>}
            {!loading && !error && teams.length > 0 && <div className="about-team-grid">{teams.map((member) => <TeamMemberCard key={member.id} member={member} />)}</div>}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-container about-cta__inner">
          <span className="about-eyebrow">{t('about.ctaEyebrow')}</span>
          <h2>{t('about.ctaTitle')}</h2>
          <p>{t('about.ctaText')}</p>
          <div className="about-cta__actions">
            <Link className="about-button about-button--light" to="/course-category">{t('about.exploreCourses')} <span aria-hidden="true">→</span></Link>
            <Link className="about-button about-button--outline" to="/contacts">{t('about.contactUs')}</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

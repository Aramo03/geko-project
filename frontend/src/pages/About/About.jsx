import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import OptimizedImage from '../../components/OptimizedMedia/OptimizedImage.jsx'
import TeamMemberCard from '../../components/TeamMemberCard/TeamMemberCard.jsx'
import { ABOUT_VALUES, REFERENCE_INSTRUCTORS, teamListFromResponse } from './about.js'
import './about.css'

const containerClass =
  'mx-auto w-[min(1120px,calc(100%-5rem))] max-[760px]:w-[min(100%-2.5rem,560px)] max-[480px]:w-[calc(100%-2rem)]'

function SectionHeading({ eyebrow, title, text }) {
  const { t } = useTranslation()
  return (
    <header className="group mx-auto mb-10 max-w-[440px] text-center">
      <span className="about-eyebrow-line mb-1 block text-[0.66rem] font-extrabold uppercase tracking-[0.045em] text-brand">
        {t(eyebrow)}
      </span>
      <h2 className="my-2 text-[clamp(1.55rem,3vw,2rem)] font-[750] leading-tight text-text">
        {t(title)}
      </h2>
      <p className="mx-auto max-w-[330px] text-[0.84rem] leading-relaxed text-text-muted">
        {t(text)}
      </p>
    </header>
  )
}

function AboutIcon({ type }) {
  const paths = {
    mission: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    vision: (
      <>
        <path d="M20.8 4.8c-7.7-.8-13 2.6-13 8.1a6.3 6.3 0 0 0 6.3 6.3c5.5 0 8.9-5.3 8.1-13l-1.4-1.4Z" />
        <path d="m8 16 8-8" />
      </>
    ),
    teachers: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3a4.5 4.5 0 0 1 4.5 4.5V20M17 11l2 2 4-4" />
      </>
    ),
    learning: (
      <>
        <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23V5.5Zm18 0A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23V5.5Z" />
      </>
    ),
    tech: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9h6v6H9zM9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3" />
      </>
    ),
    programs: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 10h18m-9 3v4m-2-2h4" />
      </>
    ),
  }

  return (
    <span
      className="about-icon-spin inline-grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-brand"
      aria-hidden="true"
    >
      <svg
        className="h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[type]}
      </svg>
    </span>
  )
}

function ReferenceInstructorCard({ instructor, className = '' }) {
  const { t } = useTranslation()
  return (
    <article
      className={`about-hover-lift min-w-0 overflow-hidden rounded-[10px] border border-border bg-surface shadow-[0_5px_14px_rgb(22_45_34/4%)] animate-rise-in max-[480px]:grid max-[480px]:grid-cols-[104px_minmax(0,1fr)] ${className}`}
    >
      <div className="h-[180px] bg-brand-soft max-[480px]:min-h-full max-[480px]:h-auto" aria-hidden="true" />
      <div className="p-3.5 max-[480px]:p-3">
        <h3 className="m-0 text-[0.9rem] font-[750] leading-snug text-text">
          {t(`about.instructors.${instructor}.name`)}
        </h3>
        <p className="mt-1 inline-block rounded-[3px] bg-brand-soft px-1.5 py-0.5 text-[0.65rem] font-bold text-brand">
          {t(`about.instructors.${instructor}.role`)}
        </p>
        <p className="mt-2 text-[0.74rem] leading-snug text-text-muted">
          {t(`about.instructors.${instructor}.description`)}
        </p>
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
    api
      .get('/api/teams/')
      .then((res) => {
        if (active) setTeams(teamListFromResponse(res.data))
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [i18n.language])

  const btnPrimary =
    'about-button-arrow about-hover-lift-xs inline-flex min-h-[42px] items-center justify-center gap-2.5 rounded-[5px] border border-brand bg-brand px-4 py-2.5 text-[0.82rem] font-bold text-white no-underline shadow-[0_4px_10px_rgb(6_61_43/12%)] hover:bg-brand-dark'

  return (
    <main className="about-page text-text">
      <section
        className="about-banner-bg flex min-h-36 items-center text-white animate-rise-in"
        aria-labelledby="about-page-title"
      >
        <div className={`${containerClass} animate-rise-in`}>
          <h1 id="about-page-title" className="mb-2 text-[clamp(2rem,4vw,2.5rem)] font-[750] leading-tight">
            {t('about.pageTitle')}
          </h1>
          <nav className="flex items-center gap-2.5 text-[0.8rem]" aria-label={t('about.breadcrumb')}>
            <Link className="text-white/75 transition-colors hover:text-white" to="/">
              {t('nav.home')}
            </Link>
            <span aria-hidden="true">›</span>
            <span>{t('nav.about')}</span>
          </nav>
        </div>
      </section>

      <section
        className={`${containerClass} grid min-h-[410px] grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] items-center gap-[clamp(2rem,6vw,4rem)] py-14 max-[760px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:gap-7 max-[760px]:py-10`}
      >
        <OptimizedImage
          className="about-story-image-hover block w-full max-h-[300px] rounded-xl object-cover shadow-[0_12px_24px_rgb(22_45_34/12%)] animate-rise-in max-[760px]:max-h-[280px]"
          src="/images/mer_masin.webp"
          alt={t('about.storyImageAlt')}
          width={960}
          height={600}
          sizes="(max-width: 760px) 100vw, 55vw"
        />
        <div className="max-w-[350px] animate-rise-in animate-rise-in-delay-copy max-[760px]:max-w-none">
          <span className="about-eyebrow-line mb-1 block text-[0.66rem] font-extrabold uppercase tracking-[0.045em] text-brand">
            {t('about.storyEyebrow')}
          </span>
          <h2 className="my-2 text-[clamp(1.7rem,3vw,2.1rem)] font-[750] leading-tight">
            {t('about.storyTitle')}
          </h2>
          <p className="mb-3.5 text-[0.88rem] leading-relaxed text-text-muted">{t('about.storyText1')}</p>
          <p className="mb-3.5 text-[0.88rem] leading-relaxed text-text-muted">{t('about.storyText2')}</p>
          <Link className={btnPrimary} to="/course-category">
            {t('about.learnMore')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="bg-surface-soft py-14 max-[760px]:py-11">
        <div className={containerClass}>
          <SectionHeading eyebrow="about.missionEyebrow" title="about.missionHeading" text="about.missionIntro" />
          <div className="grid grid-cols-2 gap-5 max-[480px]:grid-cols-1 max-[480px]:gap-3.5">
            {['mission', 'vision'].map((type, index) => (
              <article
                key={type}
                className={`about-hover-icon about-hover-lift min-h-[190px] rounded-[10px] border border-transparent bg-white p-6 shadow-[0_6px_18px_rgb(18_50_34/4%)] animate-rise-in max-[480px]:min-h-0 max-[480px]:p-5 ${index === 1 ? 'animate-rise-in-delay-1' : ''}`}
              >
                <AboutIcon type={type} />
                <h3 className="my-3 text-base font-[750]">{t(`about.${type}Title`)}</h3>
                <p className="m-0 max-w-[330px] text-[0.83rem] leading-relaxed text-text-muted">
                  {t(`about.${type}Text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${containerClass} py-14 pb-12 max-[760px]:py-11`}>
        <SectionHeading eyebrow="about.valuesEyebrow" title="about.valuesTitle" text="about.valuesIntro" />
        <div className="grid grid-cols-4 gap-3.5 max-[760px]:grid-cols-2 max-[480px]:gap-2.5">
          {ABOUT_VALUES.map(({ key, icon }, index) => (
            <article
              key={key}
              className={`about-hover-icon about-hover-lift min-h-[150px] rounded-lg border border-border p-4 text-center animate-rise-in max-[480px]:min-h-[155px] max-[480px]:px-2.5 ${
                index === 1 ? 'animate-rise-in-delay-1' : index === 2 ? 'animate-rise-in-delay-2' : index === 3 ? 'animate-rise-in-delay-3' : ''
              }`}
            >
              <AboutIcon type={icon} />
              <h3 className="my-2.5 text-[0.86rem] font-[750]">{t(`about.values.${key}.title`)}</h3>
              <p className="m-0 text-[0.73rem] leading-snug text-text-muted">{t(`about.values.${key}.text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-soft py-9 max-[480px]:py-6" aria-label={t('about.statsTitle')}>
        <div className={`${containerClass} grid grid-cols-4 gap-4 max-[480px]:grid-cols-2 max-[480px]:gap-y-5`}>
          {['students', 'courses', 'educators', 'trust'].map((key, index) => (
            <div
              key={key}
              className={`about-hover-lift-sm grid gap-1 rounded-[10px] px-2 py-3.5 text-center animate-rise-in ${
                index === 1 ? 'animate-rise-in-delay-1' : index === 2 ? 'animate-rise-in-delay-2' : index === 3 ? 'animate-rise-in-delay-3' : ''
              } hover:bg-white/55`}
            >
              <strong className="about-stat-strong text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-none text-brand-dark">
                {t(`about.stats.${key}.number`)}
              </strong>
              <span className="text-[0.78rem] text-text">{t(`about.stats.${key}.label`)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-soft py-14 pb-16 max-[760px]:py-11">
        <div className={containerClass}>
          <SectionHeading eyebrow="about.teamEyebrow" title="about.team" text="about.teamIntro" />
          <div className="about-team" aria-busy={loading}>
            {loading && <p className="my-4 text-center text-text-muted">{t('common.loading')}</p>}
            {error && (
              <div className="grid grid-cols-4 gap-4 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-3.5">
                {REFERENCE_INSTRUCTORS.map((instructor, index) => (
                  <ReferenceInstructorCard
                    key={instructor}
                    instructor={instructor}
                    className={
                      index === 1
                        ? 'animate-rise-in-delay-1'
                        : index === 2
                          ? 'animate-rise-in-delay-2'
                          : index === 3
                            ? 'animate-rise-in-delay-3'
                            : ''
                    }
                  />
                ))}
              </div>
            )}
            {!loading && !error && teams.length === 0 && (
              <p className="my-4 text-center text-text-muted">{t('about.empty')}</p>
            )}
            {!loading && !error && teams.length > 0 && (
              <div className="grid grid-cols-4 gap-4 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-3.5">
                {teams.map((member, index) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    riseDelayClass={
                      index === 1
                        ? 'animate-rise-in-delay-1'
                        : index === 2
                          ? 'animate-rise-in-delay-2'
                          : index === 3
                            ? 'animate-rise-in-delay-3'
                            : ''
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="about-cta-bg py-14 text-center text-white animate-rise-in">
        <div className={`${containerClass} animate-rise-in`}>
          <span className="about-eyebrow-line mx-auto mb-1 block text-[0.66rem] font-extrabold uppercase tracking-[0.045em] text-cta-accent">
            {t('about.ctaEyebrow')}
          </span>
          <h2 className="my-2 text-[clamp(1.7rem,3vw,2.15rem)] font-[750] leading-snug">{t('about.ctaTitle')}</h2>
          <p className="mx-auto mb-5 max-w-[400px] text-[0.88rem] leading-relaxed text-white/78">{t('about.ctaText')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className={`${btnPrimary} border-white bg-white text-brand-dark hover:text-white`}
              to="/course-category"
            >
              {t('about.exploreCourses')} <span aria-hidden="true">→</span>
            </Link>
            <Link
              className="about-hover-lift-xs inline-flex min-h-[42px] items-center justify-center rounded-[5px] border border-white/80 bg-transparent px-4 py-2.5 text-[0.82rem] font-bold text-white no-underline hover:border-white hover:bg-white/15"
              to="/contacts"
            >
              {t('about.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

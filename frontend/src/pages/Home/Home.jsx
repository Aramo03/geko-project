import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asList, blockText, findBlock, lessonContent, lessonTitle } from './home.js'
export default function Home() {
  const { t, i18n } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [lessons, setLessons] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [lessonsLoading, setLessonsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(false)
  const [lessonsError, setLessonsError] = useState(false)
  const [blocks, setBlocks] = useState([])
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroError, setHeroError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setReviewsLoading(true)
    setReviewsError(false)
    setReviews([])

    api
      .get('/api/reviews/')
      .then((res) => {
        if (cancelled) return
        const list = asList(res.data)
        if (!list) {
          setReviewsError(true)
          return
        }
        setReviews(list)
      })
      .catch(() => {
        if (!cancelled) setReviewsError(true)
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLessonsLoading(true)
    setLessonsError(false)
    setLessons([])

    api
      .get('/api/lesson_info/')
      .then((res) => {
        if (cancelled) return
        const list = asList(res.data)
        if (!list) {
          setLessonsError(true)
          return
        }
        setLessons(list)
      })
      .catch(() => {
        if (!cancelled) setLessonsError(true)
      })
      .finally(() => {
        if (!cancelled) setLessonsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [i18n.language])

  useEffect(() => {
    let cancelled = false
    setHeroLoading(true)
    setHeroError(false)
    setBlocks([])

    api
      .get('/api/ui-blocks/')
      .then((res) => {
        if (cancelled) return
        const list = asList(res.data)
        if (!list) {
          setHeroError(true)
          return
        }
        setBlocks(list)
      })
      .catch(() => {
        if (!cancelled) setHeroError(true)
      })
      .finally(() => {
        if (!cancelled) setHeroLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [i18n.language])

  const hero = findBlock(blocks, 'hero')
  const heroTitle = blockText(hero?.payload?.title, i18n.language)
  const heroText = blockText(hero?.payload?.text, i18n.language)

  return (
    <main className="page-shell">
      <h1 className="mb-8 text-2xl font-bold text-brand">{t('nav.home')}</h1>
      <section className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold text-brand-ink">{t('home.hero')}</h2>
        {heroLoading && <p className="text-text-muted">{t('common.loading')}</p>}
        {heroError && <p className="text-error">{t('common.error')}</p>}
        {!heroLoading && !heroError && !heroTitle && !heroText && <p className="text-text-muted">{t('common.empty')}</p>}
        {heroTitle && <p className="text-2xl font-bold text-brand">{heroTitle}</p>}
        {heroText && <p className="max-w-2xl text-text-muted">{heroText}</p>}
      </section>
      <section className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold text-brand-ink">{t('home.reviews')}</h2>
        {reviewsLoading && <p className="text-text-muted">{t('common.loading')}</p>}
        {reviewsError && <p className="text-error">{t('common.error')}</p>}
        {!reviewsLoading && !reviewsError && reviews.length === 0 && <p className="text-text-muted">{t('common.empty')}</p>}
        {!reviewsLoading && !reviewsError && reviews.length > 0 && (
          <ul className="list-disc space-y-4 pl-5">
            {reviews.map((review) => (
              <li key={review.id} className="animate-rise-in">
                <strong className="text-text">{review.full_name}</strong>{' '}
                <span className="text-text-muted">({review.rating}/5)</span>
                <p className="mt-1 text-text-muted">{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-ink">{t('home.lessons')}</h2>
        {lessonsLoading && <p className="text-text-muted">{t('common.loading')}</p>}
        {lessonsError && <p className="text-error">{t('common.error')}</p>}
        {!lessonsLoading && !lessonsError && lessons.length === 0 && <p className="text-text-muted">{t('common.empty')}</p>}
        {!lessonsLoading && !lessonsError && lessons.length > 0 && (
          <ul className="list-disc space-y-3 pl-5">
            {lessons.map((lesson) => {
              const title = lessonTitle(lesson) || t('home.untitled')
              const content = lessonContent(lesson)
              return (
                <li key={lesson.id} className="text-text">
                  {title}
                  {content ? <p className="mt-1 text-sm text-text-muted">{content}</p> : null}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}

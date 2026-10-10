import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asList, blockText, findBlock, lessonContent, lessonTitle } from './home.js'
import './home.css'

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
    <main className="page home-page">
      <h1>{t('nav.home')}</h1>
      <section className="home-section">
        <h2>{t('home.hero')}</h2>
        {heroLoading && <p>{t('common.loading')}</p>}
        {heroError && <p className="error">{t('common.error')}</p>}
        {!heroLoading && !heroError && !heroTitle && !heroText && <p>{t('common.empty')}</p>}
        {heroTitle && <p className="hero-title">{heroTitle}</p>}
        {heroText && <p>{heroText}</p>}
      </section>
      <section className="home-section">
        <h2>{t('home.reviews')}</h2>
        {reviewsLoading && <p>{t('common.loading')}</p>}
        {reviewsError && <p className="error">{t('common.error')}</p>}
        {!reviewsLoading && !reviewsError && reviews.length === 0 && <p>{t('common.empty')}</p>}
        {!reviewsLoading && !reviewsError && reviews.length > 0 && (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.full_name}</strong> ({review.rating}/5)
                <p className="review-text">{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="home-section">
        <h2>{t('home.lessons')}</h2>
        {lessonsLoading && <p>{t('common.loading')}</p>}
        {lessonsError && <p className="error">{t('common.error')}</p>}
        {!lessonsLoading && !lessonsError && lessons.length === 0 && <p>{t('common.empty')}</p>}
        {!lessonsLoading && !lessonsError && lessons.length > 0 && (
          <ul>
            {lessons.map((lesson) => {
              const title = lessonTitle(lesson) || t('home.untitled')
              const content = lessonContent(lesson)
              return (
                <li key={lesson.id}>
                  {title}
                  {content ? <p className="lesson-content">{content}</p> : null}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}

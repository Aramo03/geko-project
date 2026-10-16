import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import HeroMedia from '../../components/HeroMedia/HeroMedia.jsx'
import Lessons from '../../components/Lessons/Lessons.jsx'
import Reviews from '../../components/Reviews/Reviews.jsx'
import { asList, lessonContent, lessonTitle } from './home.js'
import './home.css'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [lessons, setLessons] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [lessonsLoading, setLessonsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(false)
  const [lessonsError, setLessonsError] = useState(false)

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

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__shell">
          <div className="home-hero__copy">
            <p className="home-hero__kicker">{t('home.heroKicker')}</p>
            <h1 id="home-hero-title" className="home-hero__title">
              {t('home.heroTitle')}
            </h1>
            <p className="home-hero__text">{t('home.heroText')}</p>
            <Link className="home-hero__cta" to="/contacts">
              {t('home.heroCta')}
            </Link>
          </div>
          <div className="home-hero__media">
            <HeroMedia />
          </div>
        </div>
      </section>

      <section className="home-section home-shell">
        <Reviews reviews={reviews} loading={reviewsLoading} error={reviewsError} />
      </section>

      <section className="home-section home-shell">
        <Lessons
          lessons={lessons}
          loading={lessonsLoading}
          error={lessonsError}
          lessonTitle={lessonTitle}
          lessonContent={lessonContent}
        />
      </section>
    </main>
  )
}

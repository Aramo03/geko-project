import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import HeroMedia from '../../components/HeroMedia/HeroMedia.jsx'
import HomeLegacy from '../../components/HomeLegacy/HomeLegacy.jsx'
import HomePhilosophy from '../../components/HomePhilosophy/HomePhilosophy.jsx'
import PopularCourses from '../../components/PopularCourses/PopularCourses.jsx'
import WhyGeko from '../../components/WhyGeko/WhyGeko.jsx'
import Reviews from '../../components/Reviews/Reviews.jsx'
import Lessons from '../../components/Lessons/Lessons.jsx'
import { asList } from './home.js'
import './home.css'

export default function Home() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(false)

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

      <HomeLegacy />
      <HomePhilosophy />
      <PopularCourses />
      <WhyGeko />

      <section className="home-shell">
        <Lessons />
      </section>

      <section className="home-section home-shell home-success">
        <Reviews
          reviews={reviews}
          loading={reviewsLoading}
          error={reviewsError}
          variant="success"
        />
      </section>
    </main>
  )
}

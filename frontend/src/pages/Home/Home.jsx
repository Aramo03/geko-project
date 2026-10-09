import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import Hero from '../../components/Hero/Hero.jsx'
import './home.css'

export default function Home() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    Promise.all([
      api.get('/api/reviews/'),
      api.get('/api/lesson_info/'),
    ])
      .then(([reviewsRes, lessonsRes]) => {
        setReviews(reviewsRes.data)
        setLessons(lessonsRes.data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page home-page">
      <Hero />
      <h1>{t('nav.home')}</h1>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && (
        <>
          <section>
            <h2>{t('home.reviews')}</h2>
            {reviews.length === 0 ? (
              <p>{t('common.empty')}</p>
            ) : (
              <ul>
                {reviews.map((r) => (
                  <li key={r.id}>
                    <strong>{r.full_name}</strong> ({r.rating}/5): {r.text}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2>{t('home.lessons')}</h2>
            {lessons.length === 0 ? (
              <p>{t('common.empty')}</p>
            ) : (
              <ul>
                {lessons.map((lesson) => {
                  const tr = pickTranslation(lesson.translations)
                  return (
                    <li key={lesson.id}>
                      {tr?.title || `Lesson ${lesson.id}`}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
    
  )
}

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { asReviewList } from './reviews.js'
import './reviews.css'

const reviewsApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000',
})

export default function Reviews() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(false)
    setReviews([])

    reviewsApi
      .get('/api/reviews/')
      .then((res) => {
        if (cancelled) return

        const list = asReviewList(res.data)

        if (!list) {
          setError(true)
          return
        }

        setReviews(list)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="home-reviews">
      <h2>{t('home.reviews')}</h2>

      {loading && <p>{t('common.loading')}</p>}

      {error && <p className="error">{t('common.error')}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p>{t('common.empty')}</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="home-reviews__list">
          {reviews.map((review) => (
            <article
              className="home-reviews__card"
              key={review.id}
            >
              <div className="home-reviews__header">
                <h3>{review.full_name}</h3>

                <span
                  className="home-reviews__rating"
                  aria-label={`${review.rating} / 5`}
                >
                  {'★'.repeat(
                    Math.max(0, Math.min(5, Number(review.rating) || 0)),
                  )}
                  <span className="home-reviews__rating-value">
                    {' '}
                    {review.rating}/5
                  </span>
                </span>
              </div>

              <p className="home-reviews__text">{review.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asReviewList } from './reviews.js'
import './reviews.css'

export default function Reviews({
  reviews: suppliedReviews,
  loading: suppliedLoading,
  error: suppliedError,
  variant = 'default',
} = {}) {
  const { t } = useTranslation()
  const [fetchedReviews, setFetchedReviews] = useState([])
  const [fetchedLoading, setFetchedLoading] = useState(true)
  const [fetchedError, setFetchedError] = useState(false)
  const controlled = suppliedReviews !== undefined
  const reviewsData = controlled ? suppliedReviews : fetchedReviews
  const reviews = Array.isArray(reviewsData) ? reviewsData : []
  const loading = controlled ? suppliedLoading : fetchedLoading
  const error = controlled ? suppliedError : fetchedError
  const isSuccess = variant === 'success'

  useEffect(() => {
    if (controlled) return undefined
    let cancelled = false

    setFetchedLoading(true)
    setFetchedError(false)
    setFetchedReviews([])

    api
      .get('/api/reviews/')
      .then((res) => {
        if (cancelled) return

        const list = asReviewList(res.data)

        if (!list) {
          setFetchedError(true)
          return
        }

        setFetchedReviews(list)
      })
      .catch(() => {
        if (!cancelled) setFetchedError(true)
      })
      .finally(() => {
        if (!cancelled) setFetchedLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [controlled])

  const titleKey = isSuccess ? 'home.successStories.title' : 'home.reviews'
  const kickerKey = isSuccess ? 'home.successStories.kicker' : null
  const leadKey = isSuccess ? 'home.successStories.lead' : null

  return (
    <section
      className={`home-reviews${isSuccess ? ' home-reviews--success' : ''}`}
      aria-labelledby="home-reviews-title"
    >
      {kickerKey ? (
        <p className="home-section-kicker home-section-kicker--center">{t(kickerKey)}</p>
      ) : null}
      <h2 id="home-reviews-title">{t(titleKey)}</h2>
      {leadKey ? <p className="home-reviews__lead">{t(leadKey)}</p> : null}

      {loading && <p role="status">{t('common.loading')}</p>}

      {error && <p className="error" role="alert">{t('common.error')}</p>}

      {!loading && !error && reviews.length === 0 && <p>{t('common.empty')}</p>}

      {!loading && !error && reviews.length > 0 && (
        <div className="home-reviews__list">
          {reviews.map((review) => (
            <article className="home-reviews__card" key={review.id}>
              <div className="home-reviews__header">
                <h3>{review.full_name}</h3>

                <span
                  className="home-reviews__rating"
                  role="img"
                  aria-label={t('home.reviewsRating', {
                    rating: Number(review.rating) || 0,
                  })}
                >
                  {'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                  <span className="home-reviews__rating-value"> {review.rating}/5</span>
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

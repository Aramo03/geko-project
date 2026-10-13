import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import { eventCover, formatDate, resolveImage } from '../EventCard/eventCard.js'
import { galleryImages, nextIndex } from './eventDetails.js'
import './eventDetails.css'

export default function EventDetails() {
  const { t, i18n } = useTranslation()
  const { tab, id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setSlide(0)
    api
      .get(`/api/events/${id}/`)
      .then((res) => {
        if (!cancelled) setEvent(res.data)
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
  }, [id, i18n.language])

  const back = (
    <Link to={`/events/${tab}`} className="event-details__back">
      ← {t('events.back')}
    </Link>
  )

  if (loading) {
    return (
      <main className="event-details">
        <div className="event-details__content">
          <p>{t('common.loading')}</p>
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="event-details">
        <div className="event-details__content">
          {back}
          <p className="event-details__error">{t('common.error')}</p>
        </div>
      </main>
    )
  }

  const tr = pickTranslation(event.translations)
  const title = tr?.title || t('events.untitled')
  const images = galleryImages(event, resolveImage, eventCover(event))

  return (
    <main className="event-details">
      <section className="event-details__hero">
        <nav className="event-details__crumbs" aria-label="breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/events/${tab}`}>{t('events.title')}</Link>
        </nav>
        <h1 className="event-details__title">{title}</h1>
        {event.date && (
          <p className="event-details__date">
            {t('events.date')}: {formatDate(event.date, i18n.language)}
          </p>
        )}
      </section>

      <div className="event-details__content">
        {back}

        {images.length > 0 && (
          <div className="event-details__gallery">
            <img src={images[slide]} alt={title} />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="event-details__arrow event-details__arrow--prev"
                  aria-label={t('events.prev')}
                  onClick={() => setSlide(nextIndex(slide, images.length, -1))}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="event-details__arrow event-details__arrow--next"
                  aria-label={t('events.next')}
                  onClick={() => setSlide(nextIndex(slide, images.length, 1))}
                >
                  ›
                </button>
                <span className="event-details__counter">
                  {slide + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        )}

        {tr?.description && (
          <>
            <h2 className="event-details__subtitle">{t('events.description')}</h2>
            <p className="event-details__text">{tr.description}</p>
          </>
        )}

        <Link to="/contacts" className="event-details__signup">
          {t('events.signUp')}
        </Link>
      </div>
    </main>
  )
}

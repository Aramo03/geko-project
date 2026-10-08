import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import { eventCover, formatDate, resolveImage } from '../EventCard/eventCard.js'
import { galleryImages } from './eventDetails.js'
import './eventDetails.css'

export default function EventDetails() {
  const { t, i18n } = useTranslation()
  const { tab, id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setSlide(0)
    api
      .get(`/api/events/${id}/`)
      .then((res) => setEvent(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id, i18n.language])

  if (loading) return <main className="event-details"><p>{t('common.loading')}</p></main>
  if (error || !event) return <main className="event-details"><p className="error">{t('common.error')}</p></main>

  const tr = pickTranslation(event.translations)
  const images = galleryImages(event, resolveImage, eventCover(event))

  return (
    <main className="event-details">
      <Link to={`/events/${tab}`} className="event-details__back">← {t('events.back')}</Link>
      <h1>{tr?.title || `Event ${event.id}`}</h1>

      {images.length > 0 && (
        <div className="event-details__gallery">
          <img src={images[slide]} alt={tr?.title || ''} />
          {images.length > 1 && (
            <>
              <button type="button" aria-label="prev"
                onClick={() => setSlide((slide - 1 + images.length) % images.length)}>‹</button>
              <button type="button" aria-label="next"
                onClick={() => setSlide((slide + 1) % images.length)}>›</button>
            </>
          )}
        </div>
      )}

      <p className="event-details__date">{t('events.date')}: {formatDate(event.date, i18n.language)}</p>
      <h2>{t('events.description')}</h2>
      <p>{tr?.description}</p>

      <Link to="/contacts" className="event-details__signup">{t('events.signUp')}</Link>
    </main>
  )
}
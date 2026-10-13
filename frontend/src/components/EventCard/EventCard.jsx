import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { pickTranslation } from '../../api/client.js'
import { eventCover, formatDate } from './eventCard.js'
import './eventCard.css'

export default function EventCard({ event, variant = 'featured' }) {
  const { t, i18n } = useTranslation()
  const tr = pickTranslation(event.translations)
  const cover = eventCover(event)
  const title = tr?.title || t('events.untitled')
  const href = `/events/${event.status}/${event.id}`
  const featured = variant === 'featured'

  return (
    <article className={`event-card event-card--${variant}`}>
      <Link to={href} className="event-card__media">
        {cover ? (
          <img className="event-card__image" src={cover} alt={title} loading="lazy" />
        ) : (
          <span className="event-card__placeholder" aria-hidden="true">
            {title.charAt(0)}
          </span>
        )}
      </Link>
      <div className="event-card__body">
        {featured && event.date && (
          <time className="event-card__date" dateTime={event.date}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formatDate(event.date, i18n.language)}
          </time>
        )}
        <h3 className="event-card__title">
          <Link to={href}>{title}</Link>
        </h3>
        {tr?.description && <p className="event-card__text">{tr.description}</p>}
        {featured && (
          <Link to={href} className="event-card__btn">
            {t('events.more')}
          </Link>
        )}
      </div>
    </article>
  )
}

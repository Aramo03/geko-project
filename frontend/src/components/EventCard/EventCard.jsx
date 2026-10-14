import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'
import { pickTranslation } from '../../api/client.js'
import { eventCover, formatDate } from './eventCard.js'
import './eventCard.css'

export default function EventCard({ event }) {
  const { t, i18n } = useTranslation()
  const tr = pickTranslation(event.translations)
  const cover = eventCover(event)
  const title = tr?.title || t('events.untitled')
  const href = `/events/${event.status}/${event.id}`

  return (
    <article className="event-card">
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
        {event.date ? (
          <time className="event-card__date" dateTime={event.date}>
            <Calendar size={14} strokeWidth={2} aria-hidden="true" />
            {formatDate(event.date, i18n.language)}
          </time>
        ) : null}
        <h3 className="event-card__title">
          <Link to={href}>{title}</Link>
        </h3>
        {tr?.description ? <p className="event-card__text">{tr.description}</p> : null}
        <Link to={href} className="event-card__btn">
          {t('events.more')}
        </Link>
      </div>
    </article>
  )
}

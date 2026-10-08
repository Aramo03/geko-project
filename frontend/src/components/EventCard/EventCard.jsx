import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { pickTranslation } from '../../api/client.js'
import { eventCover, formatDate } from './eventCard.js'
import './eventCard.css'

export default function EventCard({ event }) {
  const { i18n } = useTranslation()
  const tr = pickTranslation(event.translations)
  const cover = eventCover(event)

  return (
    <article className="event-card">
      {cover && <img className="event-card__image" src={cover} alt={tr?.title || ''} />}
      <div className="event-card__body">
        <time className="event-card__date">{formatDate(event.date, i18n.language)}</time>
        <h3 className="event-card__title">
          <Link to={`/events/${event.status}/${event.id}`}>
            {tr?.title || `Event ${event.id}`}
          </Link>
        </h3>
        {tr?.description && <p className="event-card__text">{tr.description}</p>}
      </div>
    </article>
  )
}
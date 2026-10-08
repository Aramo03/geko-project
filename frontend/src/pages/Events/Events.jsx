import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import EventCard from '../../components/EventCard/EventCard.jsx'
import { TABS, DEFAULT_TAB } from './events.js'
import './events.css'
import EventDetails from '../../components/EventDetails/EventDetails.jsx'

export default function Events() {
  const { t, i18n } = useTranslation()
  const { tab, id } = useParams()
  const [events, setEvents] = useState({ upcoming: [], happening: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    Promise.all(
      TABS.map((status) => api.get('/api/events/', { params: { status } }))
    )
      .then((responses) => {
        const next = {}
        TABS.forEach((status, i) => {
          next[status] = responses[i].data
        })
        setEvents(next)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [i18n.language])

  if (!TABS.includes(tab)) {
    return <Navigate to={`/events/${DEFAULT_TAB}`} replace />
  }

  if (id) return <EventDetails /> 

  const list = events[tab]

  return (
    <main className="events-page">
      <h1>{t('events.title')}</h1>
      <nav className="events-tabs">
        {TABS.map((status) => {
          const isEmpty = events[status].length === 0
          if (isEmpty) {
            return (
              <span key={status} className="events-tab events-tab--disabled" aria-disabled="true">
                {t(`events.${status}`)}
              </span>
            )
          }
          return (
            <Link
              key={status}
              to={`/events/${status}`}
              className={`events-tab ${status === tab ? 'events-tab--active' : ''}`}
            >
              {t(`events.${status}`)}
            </Link>
          )
        })}
      </nav>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && list.length === 0 && <p>{t('common.empty')}</p>}
      {!loading && !error && list.map((event) => <EventCard key={event.id} event={event} />)}
    </main>
  )
}
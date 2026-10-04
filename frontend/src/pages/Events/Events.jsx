import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import './events.css'

const TABS = ['upcoming', 'happening', 'completed']

export default function Events() {
  const { t } = useTranslation()
  const { tab } = useParams()
  const activeTab = TABS.includes(tab) ? tab : 'upcoming'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    api
      .get('/api/events/', { params: { status: activeTab } })
      .then((res) => setEvents(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <main className="page events-page">
      <h1>{t('events.title')}</h1>
      <nav className="events-tabs">
        {TABS.map((status) => (
          <Link
            key={status}
            to={`/events/${status}`}
            className={status === activeTab ? 'active' : ''}
          >
            {t(`events.${status}`)}
          </Link>
        ))}
      </nav>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && events.length === 0 && <p>{t('common.empty')}</p>}
      <ul>
        {events.map((event) => {
          const tr = pickTranslation(event.translations)
          return (
            <li key={event.id}>
              <strong>{tr?.title || `Event ${event.id}`}</strong>
              {tr?.description && <p>{tr.description}</p>}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

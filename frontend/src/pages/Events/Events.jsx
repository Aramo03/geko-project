import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'

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
    <main className="page-shell">
      <h1 className="mb-6 text-2xl font-bold text-brand">{t('events.title')}</h1>
      <nav className="mb-6 flex flex-wrap gap-3">
        {TABS.map((status) => (
          <Link
            key={status}
            to={`/events/${status}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
              status === activeTab
                ? 'bg-brand text-white'
                : 'border border-border bg-surface text-text hover:bg-surface-soft'
            }`}
          >
            {t(`events.${status}`)}
          </Link>
        ))}
      </nav>
      {loading && <p className="text-text-muted">{t('common.loading')}</p>}
      {error && <p className="text-error">{t('common.error')}</p>}
      {!loading && !error && events.length === 0 && <p className="text-text-muted">{t('common.empty')}</p>}
      <ul className="list-none space-y-4 p-0">
        {events.map((event) => {
          const tr = pickTranslation(event.translations)
          return (
            <li
              key={event.id}
              className="rounded-[10px] border border-border bg-surface p-4 animate-rise-in"
            >
              <strong className="text-text">{tr?.title || `Event ${event.id}`}</strong>
              {tr?.description && <p className="mt-2 text-text-muted">{tr.description}</p>}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

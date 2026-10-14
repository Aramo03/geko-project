import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import EventCard from '../../components/EventCard/EventCard.jsx'
import EventDetails from '../../components/EventDetails/EventDetails.jsx'
import {
  DEFAULT_TAB,
  TABS,
  emptyEventsByStatus,
  fetchEventsByStatus,
  isEventsTab,
} from './events.js'
import './events.css'

export default function Events() {
  const { t, i18n } = useTranslation()
  const { tab, id } = useParams()
  const [events, setEvents] = useState(emptyEventsByStatus())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) return undefined
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchEventsByStatus(api)
      .then((grouped) => {
        if (cancelled) return
        if (!grouped) {
          setError(true)
          return
        }
        setEvents(grouped)
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
  }, [i18n.language, id])

  if (!isEventsTab(tab)) {
    return <Navigate to={`/events/${DEFAULT_TAB}`} replace />
  }

  if (id) return <EventDetails />

  const list = events[tab] || []
  const ready = !loading && !error

  return (
    <main className="events-page">
      <section className="events-hero">
        <nav className="events-hero__crumbs" aria-label="breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span aria-hidden="true">/</span>
          <span>{t(`events.${tab}`)}</span>
        </nav>
        <p className="events-kicker">{t('events.kicker')}</p>
        <h1 className="events-hero__title">{t(`events.hero.${tab}`)}</h1>
      </section>

      <section className="events-section">
        <div className="events-shell">
          <nav className="events-tabs" aria-label={t('events.title')}>
            {TABS.map((status) => {
              const label = t(`events.${status}`)
              const isActive = status === tab
              const isEmpty = ready && events[status].length === 0
              const className = [
                'events-tab',
                isActive ? 'events-tab--active' : '',
                isEmpty ? 'events-tab--disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')

              if (!ready || isEmpty) {
                return (
                  <span
                    key={status}
                    className={className}
                    aria-current={isActive ? 'page' : undefined}
                    aria-disabled={!ready || isEmpty ? 'true' : undefined}
                  >
                    {label}
                  </span>
                )
              }

              return (
                <Link key={status} to={`/events/${status}`} className={className}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {loading ? <p className="events-state">{t('common.loading')}</p> : null}
          {error ? <p className="events-state events-state--error">{t('common.error')}</p> : null}
          {ready && list.length === 0 ? <p className="events-state">{t('common.empty')}</p> : null}

          {ready && list.length > 0 ? (
            <>
              <h2 className="events-heading">{t(`events.section.${tab}`)}</h2>
              <div className="events-grid">
                {list.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}

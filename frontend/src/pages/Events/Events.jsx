import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import EventCard from '../../components/EventCard/EventCard.jsx'
import EventDetails from '../../components/EventDetails/EventDetails.jsx'
import EventRegistration from '../../components/EventRegistration/EventRegistration.jsx'
import { formatDate } from '../../components/EventCard/eventCard.js'
import { TABS, DEFAULT_TAB, splitEvents, groupEventsByStatus, toRelativeApiPath } from './events.js'
import './events.css'

export default function Events() {
  const { t, i18n } = useTranslation()
  const { tab, id } = useParams()
  const [events, setEvents] = useState({ upcoming: [], happening: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) return undefined
    let cancelled = false
    setLoading(true)
    setError(false)
    async function loadEvents() {
      try {
        const allItems = []
        let path = '/api/events/'
        while (path) {
          const { data } = await api.get(path)
          if (Array.isArray(data)) {
            allItems.push(...data)
            break
          }
          if (Array.isArray(data?.results)) {
            allItems.push(...data.results)
            path = toRelativeApiPath(data.next, api.defaults.baseURL)
          } else {
            break
          }
        }
        if (!cancelled) setEvents(groupEventsByStatus(allItems))
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadEvents()
    return () => {
      cancelled = true
    }
  }, [i18n.language, id])

  if (!TABS.includes(tab)) {
    return <Navigate to={`/events/${DEFAULT_TAB}`} replace />
  }

  if (id) return <EventDetails />

  const { list, scheduled, past } = splitEvents(events, tab)
  const ready = !loading && !error

  return (
    <main className="events-page">
      <section className="events-hero">
        <nav className="events-hero__crumbs" aria-label="breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span aria-hidden="true">/</span>
          <span>{t(`events.${tab}`)}</span>
        </nav>
        <h1 className="events-hero__title">{t(`events.hero.${tab}`)}</h1>
      </section>

      <section className="events-section">
        <div className="events-container">
          <nav className="events-tabs">
            {TABS.map((status) => {
              const isEmpty = !loading && events[status].length === 0
              if (isEmpty) {
                return (
                  <span
                    key={status}
                    className="events-tab events-tab--disabled"
                    aria-disabled="true"
                  >
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

          {loading && <p className="events-state">{t('common.loading')}</p>}
          {error && <p className="events-state events-state--error">{t('common.error')}</p>}
          {ready && list.length === 0 && <p className="events-state">{t('common.empty')}</p>}

          {ready && list.length > 0 && (
            <>
              <h2 className="events-heading">{t(`events.section.${tab}`)}</h2>
              <div className="events-grid">
                {list.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {ready && scheduled.length > 0 && (
        <section className="events-section events-section--tinted">
          <div className="events-container events-band">
            <div className="events-calendar">
              <h2 className="events-heading">{t('events.calendarTitle')}</h2>
              <ul className="events-calendar__grid">
                {scheduled.map((event) => {
                  const tr = pickTranslation(event.translations)
                  return (
                    <li key={event.id} className="events-calendar__item">
                      <Link to={`/events/${event.status}/${event.id}`}>
                        <strong>{tr?.title || t('events.untitled')}</strong>
                        {event.date && <span>{formatDate(event.date, i18n.language)}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <EventRegistration events={scheduled} />
          </div>
        </section>
      )}

      {ready && past.length > 0 && (
        <section className="events-section">
          <div className="events-container">
            <h2 className="events-heading">{t('events.pastTitle')}</h2>
            <div className="events-grid">
              {past.map((event) => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

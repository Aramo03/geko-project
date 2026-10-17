import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { NAV_ITEMS, footerValue } from './footer.js'

export default function Footer() {
  const { t } = useTranslation()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    api
      .get('/api/ui-blocks/')
      .then((res) => {
        if (cancelled) return
        if (!Array.isArray(res.data)) {
          setError(true)
          return
        }
        setBlocks(res.data)
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
  }, [])

  const phone = footerValue(blocks, 'phone')
  const email = footerValue(blocks, 'email')
  const address = footerValue(blocks, 'address')
  const map = footerValue(blocks, 'map')
  const mapLink = /^https?:\/\//i.test(map) ? map : ''
  const hasContacts = phone || email || address || mapLink

  return (
    <footer className="grid gap-6 px-4 py-8 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] sm:px-8">
      <nav aria-label={t('footer.navigation')} className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-brand">{t('footer.navigation')}</h2>
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className="text-sm text-text-muted hover:text-brand">
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-brand">{t('footer.contacts')}</h2>
        {loading && <p className="m-0 text-text-muted">{t('common.loading')}</p>}
        {error && <p className="m-0 text-error">{t('common.error')}</p>}
        {!loading && !error && !hasContacts && <p className="m-0 text-text-muted">{t('common.empty')}</p>}
        {(phone || email || address) && (
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-text-muted">
            {phone && (
              <li>
                <a href={`tel:${phone}`} className="hover:text-brand">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-brand">
                  {email}
                </a>
              </li>
            )}
            {address && <li>{address}</li>}
          </ul>
        )}
        {mapLink && (
          <a href={mapLink} target="_blank" rel="noreferrer" className="text-sm text-brand hover:text-brand-hover">
            {t('footer.map')}
          </a>
        )}
      </section>
    </footer>
  )
}

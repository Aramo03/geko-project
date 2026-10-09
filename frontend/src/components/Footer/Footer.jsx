import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { NAV_ITEMS, footerValue } from './footer.js'
import './footer.css'

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
    <footer className="footer">
      <nav aria-label={t('footer.navigation')}>
        <h2>{t('footer.navigation')}</h2>
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to}>
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <section>
        <h2>{t('footer.contacts')}</h2>
        {loading && <p>{t('common.loading')}</p>}
        {error && <p className="error">{t('common.error')}</p>}
        {!loading && !error && !hasContacts && <p>{t('common.empty')}</p>}
        {(phone || email || address) && (
          <ul>
            {phone && <li><a href={`tel:${phone}`}>{phone}</a></li>}
            {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
            {address && <li>{address}</li>}
          </ul>
        )}
        {mapLink && (
          <a href={mapLink} target="_blank" rel="noreferrer">
            {t('footer.map')}
          </a>
        )}
      </section>
    </footer>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { LANGUAGES, NAV_ITEMS, contactValue } from './header.js'
import './header.css'

export default function Header() {
  const { t, i18n } = useTranslation()
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

  const phone = contactValue(blocks, 'phone')
  const email = contactValue(blocks, 'email')

  return (
    <header className="header">
      <div className="header-contacts">
        {loading && <p>{t('common.loading')}</p>}
        {error && <p className="error">{t('common.error')}</p>}
        {!loading && !error && !phone && !email && <p>{t('common.empty')}</p>}
        {phone && <a href={`tel:${phone}`}>{phone}</a>}
        {email && <a href={`mailto:${email}`}>{email}</a>}
      </div>
      <div className="header-bar">
        <Link to="/">
          <img src="/images/logo.webp" alt="GEKO" width="120" />
        </Link>
        <nav className="flex gap-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => i18n.changeLanguage(lang.code)}
              className={i18n.language === lang.code ? 'active' : ''}
            >
              <img src={lang.flag} alt={lang.code} width="24" height="16" />
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

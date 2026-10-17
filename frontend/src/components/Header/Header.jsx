import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import OptimizedImage from '../OptimizedMedia/OptimizedImage.jsx'
import { LANGUAGES, NAV_ITEMS, contactValue } from './header.js'

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
    <header className="flex flex-col gap-3 px-4 py-4 sm:px-8">
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
        {loading && <p className="m-0">{t('common.loading')}</p>}
        {error && <p className="m-0 text-error">{t('common.error')}</p>}
        {!loading && !error && !phone && !email && <p className="m-0">{t('common.empty')}</p>}
        {phone && (
          <a className="font-medium text-brand hover:text-brand-hover" href={`tel:${phone}`}>
            {phone}
          </a>
        )}
        {email && (
          <a className="font-medium text-brand hover:text-brand-hover" href={`mailto:${email}`}>
            {email}
          </a>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <OptimizedImage src="/images/logo.webp" alt="GEKO" width={120} height={40} priority />
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-text">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-brand">
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
              className={`rounded border border-transparent p-0.5 transition-colors ${i18n.language === lang.code ? 'border-brand bg-brand-soft' : 'hover:border-border'}`}
              aria-label={lang.code}
            >
              <OptimizedImage src={lang.flag} alt="" width={24} height={16} />
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

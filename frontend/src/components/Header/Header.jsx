import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, NAV_ITEMS } from './header.js'
import './header.css'

export default function Header() {
  const { t, i18n } = useTranslation()

  return (
    <header className="header">
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
          <button key={lang.code} type="button" onClick={() => i18n.changeLanguage(lang.code)}>
            <img src={lang.flag} alt={lang.code} width="24" height="16" />
          </button>
        ))}
        
      </div>
    </header>
  )
}

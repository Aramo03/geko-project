import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LEGACY_FEATURES } from './homeLegacy.js'
import './homeLegacy.css'

export default function HomeLegacy() {
  const { t } = useTranslation()

  return (
    <section className="home-legacy home-shell" aria-labelledby="home-legacy-title">
      <div className="home-legacy__grid">
        <div className="home-legacy__media" aria-hidden="true">
          <div className="home-legacy__photo" />
        </div>
        <div className="home-legacy__content">
          <p className="home-section-kicker">{t('home.legacy.kicker')}</p>
          <h2 id="home-legacy-title" className="home-section-title">
            {t('home.legacy.title')}
          </h2>
          <p className="home-legacy__lead">{t('home.legacy.lead')}</p>
          <ul className="home-legacy__list">
            {LEGACY_FEATURES.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <Link className="home-legacy__cta" to="/about-us">
            {t('home.legacy.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}

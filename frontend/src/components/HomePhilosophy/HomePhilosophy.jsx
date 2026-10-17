import { useTranslation } from 'react-i18next'
import { PHILOSOPHY_PILLS } from './homePhilosophy.js'
import './homePhilosophy.css'

export default function HomePhilosophy() {
  const { t } = useTranslation()

  return (
    <section className="home-philosophy home-shell" aria-labelledby="home-philosophy-title">
      <p className="home-section-kicker">{t('home.philosophy.kicker')}</p>
      <h2 id="home-philosophy-title" className="home-section-title home-section-title--center">
        {t('home.philosophy.title')}
      </h2>
      <p className="home-philosophy__lead">{t('home.philosophy.lead')}</p>
      <div className="home-philosophy__pills">
        {PHILOSOPHY_PILLS.map((key) => (
          <span key={key} className="home-philosophy__pill">
            {t(key)}
          </span>
        ))}
      </div>
    </section>
  )
}

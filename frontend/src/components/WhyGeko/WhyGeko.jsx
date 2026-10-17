import { useTranslation } from 'react-i18next'
import { WHY_GEKO_ITEMS } from './whyGeko.js'
import './whyGeko.css'

export default function WhyGeko() {
  const { t } = useTranslation()

  return (
    <section className="why-geko home-shell" aria-labelledby="why-geko-title">
      <p className="home-section-kicker home-section-kicker--center">{t('home.why.kicker')}</p>
      <h2 id="why-geko-title" className="home-section-title home-section-title--center">
        {t('home.why.title')}
      </h2>
      <p className="why-geko__lead">{t('home.why.lead')}</p>
      <ul className="why-geko__grid">
        {WHY_GEKO_ITEMS.map((item) => (
          <li key={item.titleKey} className="why-geko__card">
            <h3>{t(item.titleKey)}</h3>
            <p>{t(item.textKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

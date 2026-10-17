import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="page-shell text-center">
      <h1 className="mb-4 text-3xl font-bold text-brand">{t('notFound.title')}</h1>
      <p className="mb-6 text-text-muted">{t('notFound.text')}</p>
      <Link
        to="/"
        className="about-hover-lift-xs inline-flex rounded-md border border-brand bg-brand px-5 py-2.5 text-sm font-bold text-white no-underline hover:bg-brand-dark"
      >
        {t('notFound.home')}
      </Link>
    </main>
  )
}

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './notFound.css'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="page">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.text')}</p>
      <Link to="/">{t('notFound.home')}</Link>
    </main>
  )
}

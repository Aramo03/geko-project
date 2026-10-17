import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import CategoryCard from '../../components/CategoryCard/CategoryCard.jsx'
import { asList } from './courseCategory.js'
import './courseCategory.css'

export default function CourseCategoryList() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setCategories([])

    api
      .get('/api/categories/')
      .then((res) => {
        if (cancelled) return
        const list = asList(res.data)
        if (!list) {
          setError(true)
          return
        }
        setCategories(list)
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
  }, [i18n.language])

  return (
    <main className="category-page">
      <div className="category-page__shell">
        <header className="category-page__intro">
          <p className="category-page__kicker">{t('categories.kicker')}</p>
          <h1 className="category-page__title">{t('categories.popularTitle')}</h1>
          <p className="category-page__lead">{t('categories.subtitle')}</p>
        </header>

        {loading && <p className="category-page__state">{t('common.loading')}</p>}
        {error && <p className="category-page__state category-page__state--error">{t('common.error')}</p>}
        {!loading && !error && categories.length === 0 && (
          <p className="category-page__state">{t('common.empty')}</p>
        )}

        {!loading && !error && categories.length > 0 && (
          <>
            <ul className="category-page__grid">
              {categories.map((item) => (
                <li key={item.id}>
                  <CategoryCard category={item} />
                </li>
              ))}
            </ul>
            <div className="category-page__footer-cta">
              <Link to="/contacts" className="category-page__cta">
                {t('categories.viewAll')}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

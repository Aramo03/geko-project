import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client'
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
      .then((response) => {
        if (cancelled) return
        const list = asList(response.data)
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
    <main className="page course-category-page">
      <h1 className="course-category-title">{t('nav.courses')}</h1>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && categories.length === 0 && <p>{t('common.empty')}</p>}
      {!loading && !error && categories.length > 0 && (
        <ul className="category-grid">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

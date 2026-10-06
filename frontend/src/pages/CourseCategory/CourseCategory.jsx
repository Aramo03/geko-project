import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import './courseCategory.css'

export default function CourseCategory() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    const url = id ? `/api/courses/${id}/` : '/api/categories/'
    api
      .get(url)
      .then((res) => setItems(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className="page">
      <h1>{t('nav.courses')}</h1>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && items.length === 0 && <p>{t('common.empty')}</p>}
      <ul>
        {items.map((item) => {
          if (id) {
            const tr = pickTranslation(item.translations)
            return (
              <li key={item.id}>
                <Link to={`/courses/${item.id}`}>{tr?.title || `Course ${item.id}`}</Link>
              </li>
            )
          }
          const tr = pickTranslation(item.translations)
          return (
            <li key={item.id}>
              <Link to={`/course-category/${item.id}`}>
                {tr?.text || `Category ${item.id}`}
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

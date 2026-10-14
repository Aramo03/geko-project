import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client'
import { asList, categoryImageSrc, categoryTitle } from './courseCategory.js'
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
    <main className="min-h-screen bg-[#f7f9f8] py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#0a5c36]">
            {t('categories.kicker')}
          </p>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
            {t('categories.popularTitle')}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-500">
            {t('categories.subtitle')}
          </p>
        </div>

        {loading && (
          <p className="py-20 text-center text-gray-600">{t('common.loading')}</p>
        )}
        {error && (
          <p className="py-20 text-center text-red-500">{t('common.error')}</p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p className="py-20 text-center text-gray-500">{t('common.empty')}</p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const name = categoryTitle(category) || t('categories.untitled')
              const image = categoryImageSrc(category)
              return (
                <Link
                  key={category.id}
                  to={`/course-category/${category.id}`}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 h-48 overflow-hidden rounded-xl bg-gray-200">
                    {image ? (
                      <img src={image} alt={name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <span className="mb-3 inline-block w-fit rounded-md bg-[#e8f3ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0a5c36]">
                    {name}
                  </span>
                  <h2 className="text-lg font-extrabold text-gray-900">{name}</h2>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

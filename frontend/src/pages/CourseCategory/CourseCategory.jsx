import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import CategoryCard from '../../components/CategoryCard/CategoryCard.jsx'
import CategoryComments from '../../components/CategoryComments/CategoryComments.jsx'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import { asList, categoryTitle, courseTitle } from './courseCategory.js'
import './courseCategory.css'


export default function CourseCategory() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setCategories([])
    setCategory(null)
    setCourses([])

    const request = id
      ? Promise.all([
          api.get(`/api/categories/${id}/`),
          api.get(`/api/courses/${id}/`),
        ]).then(([categoryRes, coursesRes]) => {
          if (cancelled) return
          const list = asList(coursesRes.data)
          if (!list) {
            setError(true)
            return
          }
          setCategory(categoryRes.data)
          setCourses(list)
        })
      : api.get('/api/categories/').then((res) => {
          if (cancelled) return
          const list = asList(res.data)
          if (!list) {
            setError(true)
            return
          }
          setCategories(list)
        })

    request
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, i18n.language])

  const loadedTitle = categoryTitle(category)
  const title = !id || loading || error
    ? t('nav.courses')
    : loadedTitle || t('categories.untitled')

  return (
    <main className="page">
      <h1>{title}</h1>
      {id && <Link to="/course-category">{t('nav.courses')}</Link>}
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && !id && categories.length === 0 && <p>{t('common.empty')}</p>}
      {!loading && !error && !id && categories.length > 0 && (
        <ul className="category-grid">
          {categories.map((item) => (
            <li key={item.id}>
              <CategoryCard category={item} />
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && id && courses.length === 0 && <p>{t('common.empty')}</p>}
      {!loading && !error && id && courses.length > 0 && (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.id}>
              <Link to={`/courses/${course.id}`}>
                {courseTitle(course) || t('categories.untitled')}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && id && (
        <>
          <CategoryComments categoryId={id} />
          <CommentForm category={id} />
        </>
      )}
    </main>
  )
}

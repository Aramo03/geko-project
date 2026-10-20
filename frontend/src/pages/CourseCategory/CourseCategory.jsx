import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import CategoryCard from '../../components/CategoryCard/CategoryCard.jsx'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import CommentList from '../../components/CommentList/CommentList.jsx'
import CourseCard from '../../components/CourseCard/CourseCard.jsx'
import { asList, categoryTitle } from './courseCategory.js'
import './courseCategory.css'

export default function CourseCategory() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [commentCategoryId, setCommentCategoryId] = useState('')

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
          setCommentCategoryId((current) => {
            const stillThere = list.some((item) => String(item.id) === String(current))
            return stillThere ? String(current) : String(list[0]?.id || '')
          })
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

  useEffect(() => {
    setRefreshKey(0)
  }, [id])

  const loadedTitle = categoryTitle(category)
  const title = !id || loading || error
    ? t('nav.courses')
    : loadedTitle || t('categories.untitled')

  return (
    <main className="page course-category-page">
      <div className="course-category-shell">
        <header className="course-category-intro">
          {id ? (
            <Link to="/course-category" className="course-category-back">
              {t('nav.courses')}
            </Link>
          ) : null}
          <p className="course-category-kicker">{t('categories.kicker')}</p>
          <h1>{title}</h1>
          {!id ? <p className="course-category-lead">{t('categories.lead')}</p> : null}
          {id && !loading && !error ? (
            <p className="course-category-count">{t('categories.coursesInCategory')}</p>
          ) : null}
        </header>
        {loading && <p className="course-category-state">{t('common.loading')}</p>}
        {error && <p className="course-category-state course-category-state--error">{t('common.error')}</p>}
        {!loading && !error && !id && categories.length === 0 && <p>{t('common.empty')}</p>}
        {!loading && !error && !id && categories.length > 0 && (
          <ul className="category-grid">
            {categories.map((item, index) => (
              <li
                key={item.id}
                className={index < 3 ? `ui-rise-in ui-rise-in-delay-${index + 1}` : 'ui-rise-in'}
              >
                <CategoryCard category={item} />
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && id && courses.length === 0 && <p>{t('common.empty')}</p>}
        {!loading && !error && id && courses.length > 0 && (
          <ul className="course-grid">
            {courses.map((course, index) => (
              <li
                key={course.id}
                className={index < 3 ? `ui-rise-in ui-rise-in-delay-${index + 1}` : 'ui-rise-in'}
              >
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && !id && commentCategoryId ? (
          <div className="course-category-comments">
            {categories.length > 1 ? (
              <label className="course-category-comment-target">
                <span>{t('contacts.category')}</span>
                <select
                  value={commentCategoryId}
                  onChange={(event) => setCommentCategoryId(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {categoryTitle(item) || t('categories.untitled')}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <CommentList category={commentCategoryId} refreshKey={refreshKey} />
            <CommentForm
              category={commentCategoryId}
              onCreated={() => setRefreshKey((key) => key + 1)}
            />
          </div>
        ) : null}
        {!loading && !error && id && (
          <div className="course-category-comments">
            <CommentList category={id} refreshKey={refreshKey} />
            <CommentForm
              category={id}
              onCreated={() => setRefreshKey((key) => key + 1)}
            />
          </div>
        )}
      </div>
    </main>
  )
}

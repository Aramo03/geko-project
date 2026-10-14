import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client'
import CommentList from '../../components/CommentList/CommentList.jsx'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import {
  asList,
  categoryTitle,
  courseDescription,
  courseImage,
  courseTitle,
} from './courseCategory.js'
import './courseCategory.css'

export default function CourseCategoryDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [category, setCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!id) return undefined

    setLoading(true)
    setError(false)
    setCategory(null)
    setCourses([])

    Promise.all([
      api.get(`/api/categories/${id}/`),
      api.get(`/api/courses/${id}/`, { params: { category: id } }),
      api.get('/api/categories/'),
    ])
      .then(([categoryRes, coursesRes, categoriesRes]) => {
        if (cancelled) return
        const courseList = asList(coursesRes.data)
        const categoryList = asList(categoriesRes.data)
        if (!courseList || !categoryList) {
          setError(true)
          return
        }
        setCategory(categoryRes.data)
        setCourses(courseList)
        setCategories(categoryList)
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
  }, [id, i18n.language])

  const title = categoryTitle(category) || t('nav.courses')

  return (
    <main className="page course-category-page">
      <h1 className="course-category-title">{title}</h1>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && (
        <div className="course-category-layout">
          <aside className="category-sidebar">
            <h2>{t('categories.sidebar')}</h2>
            <ul className="category-sidebar-list">
              <li>
                <Link to="/course-category">{t('categories.all')}</Link>
              </li>
              {categories.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/course-category/${item.id}`}
                    className={String(item.id) === String(id) ? 'active' : ''}
                  >
                    {categoryTitle(item) || t('categories.untitled')}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="course-list-wrap">
            {courses.length === 0 && <p>{t('common.empty')}</p>}
            {courses.length > 0 && (
              <ul className="course-grid">
                {courses.map((course) => {
                  const name = courseTitle(course) || t('categories.untitled')
                  const image = courseImage(course)
                  const description = courseDescription(course)
                  return (
                    <li key={course.id}>
                      <Link to={`/courses/${course.id}`} className="course-card">
                        <div
                          className="course-card-image"
                          style={image ? { backgroundImage: `url(${image})` } : undefined}
                        />
                        <div className="course-card-body">
                          <h3 className="course-card-title">{name}</h3>
                          {description ? <p className="course-card-desc">{description}</p> : null}
                          <span className="course-card-link">{t('categories.learnMore')}</span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <section className="course-category-comments">
              <CommentList categoryId={id} />
              <CommentForm categoryId={id} />
            </section>
          </div>
        </div>
      )}
    </main>
  )
}

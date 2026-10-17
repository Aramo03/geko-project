import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import CommentList from '../../components/CommentList/CommentList.jsx'
import OptimizedImage from '../../components/OptimizedMedia/OptimizedImage.jsx'
import {
  asList,
  categoryImageSrc,
  categoryTitle,
  courseDescription,
  courseImage,
  courseLevel,
  courseStudents,
  courseTitle,
} from './courseCategory.js'
import './courseCategory.css'

export default function CourseCategoryDetail() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [category, setCategory] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setCategory(null)
    setCourses([])

    Promise.all([api.get(`/api/categories/${id}/`), api.get(`/api/courses/${id}/`)])
      .then(([categoryRes, coursesRes]) => {
        if (cancelled) return
        const list = asList(coursesRes.data)
        if (!categoryRes.data || !list) {
          setError(true)
          return
        }
        setCategory(categoryRes.data)
        setCourses(list)
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

  const title = categoryTitle(category) || t('categories.untitled')
  const heroImage = categoryImageSrc(category)
  const metaKey = category ? `categories.meta.${category.id}` : ''
  const tag = metaKey ? t(`${metaKey}.tag`, { defaultValue: t('categories.tagDefault') }) : ''

  return (
    <main className="category-page">
      <div className="category-page__shell category-page__shell--narrow">
        <nav className="category-page__crumbs" aria-label="breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/course-category">{t('nav.courses')}</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>

        {loading && <p className="category-page__state">{t('common.loading')}</p>}
        {error && <p className="category-page__state category-page__state--error">{t('common.error')}</p>}

        {!loading && !error && category && (
          <>
            <header className="category-detail__hero">
              {heroImage ? (
                <OptimizedImage
                  src={heroImage}
                  alt={title}
                  className="category-detail__hero-image"
                  sizes="(max-width: 768px) 100vw, 56rem"
                  priority
                />
              ) : null}
              <div>
                {tag ? <p className="category-page__kicker">{tag}</p> : null}
                <h1 className="category-page__title category-page__title--left">{title}</h1>
              </div>
            </header>

            <section className="category-detail__courses" aria-labelledby="category-courses-title">
              <h2 id="category-courses-title" className="category-detail__section-title">
                {t('categories.coursesInCategory')}
              </h2>
              {courses.length === 0 ? (
                <p className="category-page__state">{t('common.empty')}</p>
              ) : (
                <ul className="category-detail__course-list">
                  {courses.map((course) => {
                    const courseName = courseTitle(course) || t('course.untitled')
                    const image = courseImage(course)
                    const description = courseDescription(course)
                    const level = courseLevel(course)
                    const students = courseStudents(course)

                    return (
                      <li key={course.id} className="category-detail__course-card about-hover-lift">
                        <Link to={`/courses/${course.id}`} className="category-detail__course-link">
                          {image ? (
                            <OptimizedImage
                              src={image}
                              alt={courseName}
                              className="category-detail__course-thumb"
                              sizes="120px"
                            />
                          ) : (
                            <span className="category-detail__course-thumb category-detail__course-thumb--empty" />
                          )}
                          <div className="category-detail__course-copy">
                            <h3>{courseName}</h3>
                            {description ? <p>{description}</p> : null}
                            <div className="category-detail__course-meta">
                              {level ? <span>{level}</span> : null}
                              {students ? <span>{students}</span> : null}
                            </div>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            <section className="category-detail__comments">
              <CommentList category={id} refreshKey={commentRefreshKey} />
              <CommentForm
                category={id}
                onCreated={() => setCommentRefreshKey((key) => key + 1)}
              />
            </section>
          </>
        )}
      </div>
    </main>
  )
}

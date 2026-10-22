import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import CommentList from '../../components/CommentList/CommentList.jsx'
import OptimizedImage from '../../components/OptimizedMedia/OptimizedImage.jsx'
import { courseDescription, courseImage, courseTitle } from './courseDetails.js'
import './courseDetails.css'

export default function CourseDetails() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setCourse(null)

    api
      .get(`/api/popular_courses/${id}/`)
      .then((res) => {
        if (cancelled) return
        if (!res.data || Array.isArray(res.data)) {
          setError(true)
          return
        }
        setCourse(res.data)
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

  const title = courseTitle(course) || t('course.untitled')
  const description = courseDescription(course)
  const image = course ? courseImage(course) : ''
  const categoryId = course?.category?.id
  const categoryLabel = categoryId
    ? pickTranslation(course.category?.translations)?.text || ''
    : ''

  return (
    <main className="course-detail-page">
      <div className="course-detail-shell ui-rise-in">
        <nav className="course-detail-crumbs" aria-label="breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/course-category">{t('nav.courses')}</Link>
          {categoryId ? (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/course-category/${categoryId}`}>{categoryLabel || t('categories.untitled')}</Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>

        {loading && <p className="course-detail-state">{t('common.loading')}</p>}
        {error && <p className="course-detail-state course-detail-state--error">{t('common.error')}</p>}

        {!loading && !error && course && (
          <>
            <header className="course-detail-hero">
              <div className="course-detail-copy">
                <p className="course-detail-kicker">{t('course.kicker')}</p>
                <h1>{title}</h1>
                {description ? <p className="course-detail-lead">{description}</p> : null}
              </div>
              {image ? (
                <OptimizedImage
                  src={image}
                  alt={title}
                  className="course-detail-image animate-media-in"
                  sizes="(max-width: 768px) 100vw, 42rem"
                  priority
                />
              ) : null}
            </header>

            <section className="course-detail-comments" aria-label={t('comments.title')}>
              <CommentList popularCourse={id} refreshKey={commentRefreshKey} />
              <CommentForm
                popularCourse={id}
                onCreated={() => setCommentRefreshKey((key) => key + 1)}
              />
            </section>
          </>
        )}
      </div>
    </main>
  )
}

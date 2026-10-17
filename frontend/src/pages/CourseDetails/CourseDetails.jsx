import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import CourseComments from '../../components/CourseComments/CourseComments.jsx'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import OptimizedImage from '../../components/OptimizedMedia/OptimizedImage.jsx'
import { courseDescription, courseImage, courseTitle } from './courseDetails.js'

export default function CourseDetails() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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

  return (
    <main className="page-shell max-w-3xl">
      {loading && <p className="text-text-muted">{t('common.loading')}</p>}
      {error && <p className="text-error">{t('common.error')}</p>}
      {!loading && !error && course && (
        <>
          <h1 className="mb-4 text-2xl font-bold text-brand">{title}</h1>
          {image ? (
            <OptimizedImage
              src={image}
              alt={title}
              className="my-4 block max-h-80 w-full rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 48rem"
            />
          ) : null}
          {description ? <p className="whitespace-pre-wrap text-text-muted">{description}</p> : null}
          <div className="mt-8 space-y-8">
            <CourseComments courseId={id} />
            <CommentForm popularCourse={id} />
          </div>
        </>
      )}
    </main>
  )
}

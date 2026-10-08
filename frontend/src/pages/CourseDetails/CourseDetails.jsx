import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import CourseComments from '../../components/CourseComments/CourseComments.jsx'
import { courseDescription, courseImage, courseTitle } from './courseDetails.js'
import './courseDetails.css'

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
    <main className="page">
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && course && (
        <>
          <h1>{title}</h1>
          {image ? <img className="course-image" src={image} alt={title} /> : null}
          {description ? <p className="course-description">{description}</p> : null}
          <CourseComments courseId={id} />
        </>
      )}
    </main>
  )
}

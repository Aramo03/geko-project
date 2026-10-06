import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import './courseDetails.css'

export default function CourseDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    api
      .get('/api/popular_courses/')
      .then((res) => {
        const found = res.data.find((c) => String(c.id) === String(id))
        setCourse(found || null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const tr = course ? pickTranslation(course.translations) : null

  return (
    <main className="page">
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && !course && <p>{t('common.empty')}</p>}
      {course && (
        <>
          <h1>{tr?.title || `Course ${course.id}`}</h1>
          {tr?.description && <p>{tr.description}</p>}
        </>
      )}
    </main>
  )
}

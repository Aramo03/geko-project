import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asCommentList } from './courseComments.js'
import './courseComments.css'

export default function CourseComments({ courseId }) {
  const { t, i18n } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setComments([])

    api
      .get('/api/comments/', { params: { popular_course: courseId } })
      .then((res) => {
        if (cancelled) return
        const list = asCommentList(res.data)
        if (!list) {
          setError(true)
          return
        }
        setComments(list)
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
  }, [courseId, i18n.language])

  return (
    <section className="course-comments">
      <h2>{t('course.comments')}</h2>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && comments.length === 0 && <p>{t('common.empty')}</p>}
      {!loading && !error && comments.length > 0 && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.full_name}</strong>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

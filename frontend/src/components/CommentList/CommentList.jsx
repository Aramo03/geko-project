import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asCommentList, getCommentParams } from './commentList.js'
import './commentList.css'

export default function CommentList({ category, popularCourse, refreshKey = 0 }) {
  const { t, i18n } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = getCommentParams({ category, popularCourse })
    if (!params) {
      setComments([])
      setLoading(false)
      setError(true)
      return undefined
    }

    let active = true
    setLoading(true)
    setError(false)

    api
      .get('/api/comments/', { params })
      .then((response) => {
        if (!active) return
        const list = asCommentList(response.data)
        if (!list) {
          setError(true)
          return
        }
        setComments(list)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [category, popularCourse, refreshKey, i18n.language])

  return (
    <section className="comment-list">
      <h2>{t('comments.title')}</h2>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && comments.length === 0 && <p>{t('comments.empty')}</p>}
      {!loading && !error &&
        comments.map((comment) => (
          <article key={comment.id} className="comment-item">
            <h3>{comment.full_name}</h3>
            <p>{comment.text}</p>
            <small>{new Date(comment.created_at).toLocaleDateString()}</small>
          </article>
        ))}
    </section>
  )
}

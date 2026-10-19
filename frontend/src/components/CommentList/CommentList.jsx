import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import {
  asCommentList,
  commentInitial,
  formatCommentDate,
  getCommentParams,
} from './commentList.js'
import './commentList.css'

export default function CommentList({
  category,
  popularCourse,
  refreshKey = 0,
}) {
  const { t, i18n } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = getCommentParams({ category, popularCourse })
    let cancelled = false
    setLoading(true)
    setError(false)
    setComments([])

    if (!params) {
      setLoading(false)
      setError(true)
      return undefined
    }

    api
      .get('/api/comments/', { params })
      .then((response) => {
        if (cancelled) return
        const list = asCommentList(response.data)
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
  }, [category, popularCourse, refreshKey, i18n.language])

  return (
    <section className="comment-list">
      <h2 className="comment-list-title">{t('comments.title')}</h2>

      {loading ? <p className="comment-list-state">{t('common.loading')}</p> : null}
      {!loading && error ? (
        <p className="comment-list-state comment-list-state-error">{t('common.error')}</p>
      ) : null}
      {!loading && !error && comments.length === 0 ? (
        <p className="comment-list-state">{t('comments.empty')}</p>
      ) : null}
      {!loading && !error && comments.length > 0 ? (
        <ul className="comment-list-items">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-card">
              <div className="comment-card-head">
                <span className="comment-avatar" aria-hidden="true">
                  {commentInitial(comment.full_name)}
                </span>
                <div className="comment-card-meta">
                  <h3 className="comment-card-name">{comment.full_name}</h3>
                  <small className="comment-card-date">
                    {formatCommentDate(comment.created_at, i18n.language)}
                  </small>
                </div>
              </div>
              <p className="comment-card-text">{comment.text}</p>
              <div className="comment-card-accent" aria-hidden="true" />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

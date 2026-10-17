import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asCommentList } from './categoryComments.js'

export default function CategoryComments({ categoryId }) {
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
      .get('/api/comments/', { params: { category: categoryId } })
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
  }, [categoryId, i18n.language])

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-brand-ink">{t('categories.comments')}</h2>
      {loading && <p className="text-text-muted">{t('common.loading')}</p>}
      {error && <p className="text-error">{t('common.error')}</p>}
      {!loading && !error && comments.length === 0 && <p className="text-text-muted">{t('common.empty')}</p>}
      {!loading && !error && comments.length > 0 && (
        <ul className="list-disc space-y-3 pl-5">
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong className="text-text">{comment.full_name}</strong>
              <p className="mt-1 text-text-muted">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

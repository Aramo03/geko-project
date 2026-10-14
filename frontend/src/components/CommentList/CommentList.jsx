import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { asCommentList } from './commentList.js'
import './commentList.css'

export default function CommentList({ categoryId, popularCourseId }) {
  const { t, i18n } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setComments([])

    const params = {}
    if (categoryId) params.category = categoryId
    if (popularCourseId) params.popular_course = popularCourseId

    api
      .get('/api/comments/', { params })
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
  }, [categoryId, popularCourseId, i18n.language])

  return (
    <section>
      <h2 className="mb-4 text-xl font-extrabold text-gray-900">{t('categories.comments')}</h2>
      {loading && <p className="py-6 text-gray-600">{t('common.loading')}</p>}
      {error && <p className="py-6 text-red-500">{t('common.error')}</p>}
      {!loading && !error && comments.length === 0 && (
        <p className="py-6 text-gray-500">{t('common.empty')}</p>
      )}
      {!loading && !error && comments.length > 0 && (
        <ul className="mb-6 flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-gray-100 bg-[#f7f9f8] px-4 py-3">
              <strong className="text-sm text-[#0a5c36]">{comment.full_name}</strong>
              <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

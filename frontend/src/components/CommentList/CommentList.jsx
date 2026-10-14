import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

export default function CommentList({
  category,
  popularCourse,
  refreshKey = 0,
}) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = {}

    if (category) {
      params.category = category
    }

    if (popularCourse) {
      params.popular_course = popularCourse
    }

    setLoading(true)

    api
      .get('/api/comments/', { params })
      .then((response) => {
        setComments(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [category, popularCourse, refreshKey])

  return (
    <section className="mx-auto w-full max-w-3xl py-10">
      <h2 className="mb-8 text-2xl font-semibold text-[#333]">
        Comments
      </h2>

      {loading ? (
        <p className="rounded-2xl bg-white px-6 py-5 text-sm text-gray-500 shadow-sm">
          Loading...
        </p>
      ) : comments.length === 0 ? (
        <p className="rounded-2xl bg-white px-6 py-5 text-sm text-gray-500 shadow-sm">
          No comments yet.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-[25px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.10)]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#859c35]/15 text-lg font-semibold text-[#859c35]">
                    {comment.full_name
                      ? comment.full_name.charAt(0).toUpperCase()
                      : '?'}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#333]">
                      {comment.full_name}
                    </h3>

                    <small className="mt-1 block text-xs text-gray-400">
                      {comment.created_at
                        ? new Date(
                            comment.created_at
                          ).toLocaleDateString()
                        : ''}
                    </small>
                  </div>
                </div>

                <span className="text-xl text-[#859c35]">
                  ❝
                </span>
              </div>

              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-600">
                {comment.text}
              </p>

              <div className="mt-5 h-1 w-12 rounded-full bg-[#859c35]" />
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

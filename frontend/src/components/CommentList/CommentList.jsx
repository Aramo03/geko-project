import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import './commentList.css'

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
  }, [
    category,
    popularCourse,
    refreshKey,
  ])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!comments.length) {
    return <p>No comments yet.</p>
  }

  return (
    <section className="comment-list">
      <h2>Comments</h2>

      {comments.map((comment) => (
        <article
          key={comment.id}
          className="comment-item"
        >
          <h3>{comment.full_name}</h3>

          <p>{comment.text}</p>

          <small>
            {new Date(
              comment.created_at
            ).toLocaleDateString()}
          </small>
        </article>
      ))}
    </section>
  )
}
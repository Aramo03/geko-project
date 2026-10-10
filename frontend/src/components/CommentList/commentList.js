import { commentTarget } from '../CommentForm/commentForm.js'

export function getCommentParams({ category, popularCourse }) {
  return commentTarget(category, popularCourse)
}

export function asCommentList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return null
}

import { commentTarget } from '../CommentForm/commentForm.js'

export function getCommentParams({ category, popularCourse }) {
  return commentTarget(category, popularCourse)
}

export function asCommentList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return null
}

export function commentInitial(name) {
  const value = String(name || '').trim()
  return value ? value.charAt(0).toUpperCase() : '?'
}

export function formatCommentDate(value, language) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const code = (language || 'en').split('-')[0]
  try {
    return date.toLocaleDateString(code, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return date.toLocaleDateString()
  }
}

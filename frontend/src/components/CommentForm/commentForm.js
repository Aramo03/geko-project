
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function commentTarget(category, popularCourse) {
  const hasCourse =
    popularCourse !== undefined &&
    popularCourse !== null &&
    popularCourse !== ''

  if (!hasCourse) return null

  const courseId = Number(popularCourse)

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return null
  }

  return {
    popular_course: courseId,
  }
}

export function getCommentPayload(data, category, popularCourse) {
  const target = commentTarget(category, popularCourse)

  if (!target) return null

  return {
    full_name: data.full_name.trim(),
    email: data.email.trim(),
    whatsapp: data.whatsapp?.trim() || '',
    text: data.text.trim(),
    ...target,
  }
}

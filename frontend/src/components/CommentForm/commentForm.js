export function commentTarget(category, popularCourse) {
  const hasCategory = category !== undefined && category !== null && category !== ''
  const hasCourse = popularCourse !== undefined && popularCourse !== null && popularCourse !== ''
  if (hasCategory === hasCourse) return null
  if (hasCategory) return { category: Number(category) }
  return { popular_course: Number(popularCourse) }
}

export function getCommentPayload(data, category, popularCourse) {
  const target = commentTarget(category, popularCourse)
  if (!target) return null
  return {
    full_name: data.full_name,
    email: data.email,
    whatsapp: data.whatsapp || '',
    text: data.text,
    ...target,
  }
}

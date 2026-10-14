export function commentPayload({ values, categoryId, popularCourseId }) {
  const payload = {
    full_name: values.full_name,
    email: values.email,
    whatsapp: values.whatsapp || '',
    text: values.text,
  }

  if (categoryId) payload.category = categoryId
  if (popularCourseId) payload.popular_course = popularCourseId

  return payload
}

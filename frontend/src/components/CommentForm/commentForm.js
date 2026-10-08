export function getCommentPayload(
  data,
  category,
  popularCourse
) {
  const payload = {
    full_name: data.full_name,
    email: data.email,
    whatsapp: data.whatsapp,
    text: data.text,
  }

  if (category) {
    payload.category = category
  }

  if (popularCourse) {
    payload.popular_course = popularCourse
  }

  return payload
}
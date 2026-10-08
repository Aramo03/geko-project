export function getCommentParams({
  category,
  popularCourse,
}) {
  if (category) {
    return {
      category,
    }
  }

  if (popularCourse) {
    return {
      popular_course: popularCourse,
    }
  }

  return {}
}
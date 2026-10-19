export const ABOUT_VALUES = [
  { key: 'teachers', icon: 'teachers' },
  { key: 'learning', icon: 'learning' },
  { key: 'technology', icon: 'tech' },
  { key: 'programs', icon: 'programs' },
]

export const REFERENCE_INSTRUCTORS = ['ananya', 'marcus', 'sophia', 'vikram']

export function teamListFromResponse(data) {
  const list = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(list)) return []
  return [...list].sort((a, b) => {
    const left = a?.order ?? Number.MAX_SAFE_INTEGER
    const right = b?.order ?? Number.MAX_SAFE_INTEGER
    if (left !== right) return left - right
    return (a?.id ?? 0) - (b?.id ?? 0)
  })
}

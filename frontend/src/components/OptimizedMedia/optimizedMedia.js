export const DEFAULT_IMAGE_SIZES = '(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 560px'

export function mediaSrc(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return path.startsWith('/') ? path : `/${path}`
}

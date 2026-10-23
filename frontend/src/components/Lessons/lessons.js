import { mediaUrl } from '../../api/client.js'

export { asList } from '../../pages/Home/home.js'
export {
  lessonTitle,
  lessonContent,
} from '../../pages/Home/home.js'

export function lessonImage(lesson) {
  const raw = lesson?.image || lesson?.local_image || lesson?.image_url || ''
  if (!raw || raw.startsWith('https://') || raw.startsWith('http://')) return raw
  return mediaUrl(raw)
}

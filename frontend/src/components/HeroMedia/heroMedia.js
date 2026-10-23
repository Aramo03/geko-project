export const HERO_POSTER = '/images/mainLoad.webp'

export const HERO_VIDEO_SOURCES = [
  { src: '/videos/main.webm', type: 'video/webm' },
  { src: '/videos/main2.mp4', type: 'video/mp4' },
]

function mediaSrc(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function heroMediaFromPayload(payload) {
  const data = payload && typeof payload === 'object' ? payload : {}
  return {
    poster: mediaSrc(data.poster, HERO_POSTER),
    sources: [
      { src: mediaSrc(data.video_webm, HERO_VIDEO_SOURCES[0].src), type: 'video/webm' },
      { src: mediaSrc(data.video_mp4, HERO_VIDEO_SOURCES[1].src), type: 'video/mp4' },
    ],
  }
}

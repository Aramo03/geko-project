import { useState } from 'react'
import { HERO_POSTER, HERO_VIDEO_SOURCES } from './heroMedia.js'
import './heroMedia.css'

export default function HeroMedia({
  poster = HERO_POSTER,
  sources = HERO_VIDEO_SOURCES,
}) {
  const [videoFailed, setVideoFailed] = useState(false)

  if (videoFailed) {
    return (
      <div className="hero-media">
        <img className="hero-media__visual" src={poster} alt="" />
      </div>
    )
  }

  return (
    <div className="hero-media">
      <video
        className="hero-media__visual"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        onError={() => setVideoFailed(true)}
      >
        {sources.map((source) => (
          <source key={source.type} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  )
}

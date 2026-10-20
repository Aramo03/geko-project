import { useState } from 'react'
import { HERO_POSTER, HERO_VIDEO_SOURCES } from './heroMedia.js'
import './heroMedia.css'

export default function HeroMedia() {
  const [videoFailed, setVideoFailed] = useState(false)

  if (videoFailed) {
    return (
      <div className="hero-media">
        <img className="hero-media__visual" src={HERO_POSTER} alt="" loading="eager" />
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
        preload="auto"
        poster={HERO_POSTER}
        onError={() => setVideoFailed(true)}
      >
        {HERO_VIDEO_SOURCES.map((source) => (
          <source key={source.type} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  )
}
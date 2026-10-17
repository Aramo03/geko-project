import { mediaSrc } from './optimizedMedia.js'

export default function OptimizedVideo({
  sources = [],
  poster,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  ...rest
}) {
  const posterSrc = poster ? mediaSrc(poster) : undefined

  return (
    <video
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
      poster={posterSrc}
      {...rest}
    >
      {sources.map((source) => (
        <source key={source.type || source.src} src={mediaSrc(source.src)} type={source.type} />
      ))}
    </video>
  )
}

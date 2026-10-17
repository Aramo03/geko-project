import { mediaSrc } from './optimizedMedia.js'

export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  priority = false,
  width,
  height,
  sizes,
  ...rest
}) {
  const resolved = mediaSrc(src)
  if (!resolved) return null

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...rest}
    />
  )
}

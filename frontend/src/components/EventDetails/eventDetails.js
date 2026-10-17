export function galleryImages(event, resolveImage, cover) {
  const images = (event.gallery || [])
    .map((item) => resolveImage(item.image))
    .filter(Boolean)
  if (images.length > 0) return images
  return cover ? [cover] : []
}

export function nextIndex(current, length, step) {
  if (!length) return 0
  return (current + step + length) % length
}

export function galleryImages(event, resolveImage, cover) {
  const images = (event.gallery || []).map((g) => resolveImage(g.image)).filter(Boolean)
  if (images.length > 0) return images
  return cover ? [cover] : []
}

export function nextIndex(current, length, step) {
  return (current + step + length) % length
}

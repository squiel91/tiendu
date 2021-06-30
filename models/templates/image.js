module.exports = image => {
  if (!image) return undefined
  return {
    id: image.id,
    name: image.id,
    src: image.src,
    thumbSrc: image.thumbSrc,
    coverSrc: image.coverSrc,
    alt: image.alt
  }
}

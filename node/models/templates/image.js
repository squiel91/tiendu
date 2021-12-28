module.exports = image => {
  if (!image) return
  return {
    id: image.id,
    src: image.src,
    thumbSrc: image.thumbSrc,
    coverSrc: image.coverSrc,
    alt: image.alt
  }
}

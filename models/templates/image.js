module.exports = image => {
  if (!image) return undefined
  return {
    id: image.id,
    name: image.id,
    src: image.src,
    thumbSrc: image.src,
    coverSrc: image.src,
    alt: image.alt
  }
}

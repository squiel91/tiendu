module.exports = page => {
  return {
    id: page.id,
    title: page.title,
    published: page.published,
    handle: page.handle,
    content: page.content
  }
}

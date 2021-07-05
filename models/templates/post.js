module.exports = post => {
  return {
    id: post.id,
    title: post.title,
    author: {
      id: post.author.id,
      firstName: post.author.firstName,
      lastName: post.author.lastName,
      admin: post.author.admin || undefined
    },
    published: post.published,
    handle: post.handle,
    content: post.content,
    created: post.created?.toLocaleDateString('es-UY'),
    updated: post.updated?.toLocaleDateString('es-UY')

  }
}

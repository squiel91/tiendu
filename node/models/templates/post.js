const imageTemplate = require('../templates/image')
module.exports = post => {
  return {
    id: post.id,
    title: post.title,
    cover: imageTemplate(post.cover),
    author: `${post.author?.firstName} ${post.author?.lastName}`,
    published: post.published,
    handle: post.handle,
    content: post.content,
    created: post.created?.toLocaleDateString('es-UY'),
    updated: post.updated?.toLocaleDateString('es-UY')

  }
}

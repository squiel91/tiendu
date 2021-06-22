const imageTemplate = require('./image')

module.exports = product => {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    price: product.price,
    compareAt: product.compareAt,
    stock: product.stock,
    hasVariants: product.hasVariants,
    options: product.options,
    variants: product.variants,
    description: product.description,
    listed: product.publish,
    featured: product.featured,
    images: product.images && product.images.length > 0 ? product.images.map(img => imageTemplate(img)) : undefined,

    // deprecated
    published: product.publish
  }
}

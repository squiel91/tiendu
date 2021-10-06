const ObjectId = require('mongoose').Types.ObjectId
const productTemplate = require('./product')
const imageTemplate = require('./image')

module.exports = category => {
  if (!category) return undefined
  return {
    id: category.id,
    title: category.title,
    handle: category.handle,
    image: imageTemplate(category.image),
    products: category.products?.map(product => ObjectId.isValid(product) ? product : productTemplate(product)) || [],
    description: category.description,
    listed: category.listed,
    featured: category.featured
  }
}

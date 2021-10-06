const mongoose = require('mongoose')
const Product = require('./Product')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
  // TODO: add a index for this
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // TODO: add a index for this
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: {
    type: String,
    require: true
  },
  prodTitle: {
    type: String,
    require: true
  },
  prodHandle: {
    type: String,
    require: true
  },
  value: {
    type: Number,
    require: true
  },
  comment: String,
  created: {
    type: Date,
    require: true
  }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

reviewSchema.statics.set = async function (options) {
  const product = options.product
  const user = options.user

  options.name = user.firstName
  options.created = Date.now()

  // in case it is repeted
  await this.deleteOne({ user: user._id, product: product._id })
  product.reviews = product.reviews.filter(review => String(review.user) !== user.id)

  product.reviews.push(options)
  await product.save()

  options.prodTitle = product.title
  options.prodHandle = product.handle
  return await this.create(options)
}

reviewSchema.methods.createdHuman = function () {
  return this.created.toLocaleDateString('es-ES')
}

module.exports = mongoose.model('Review', reviewSchema)

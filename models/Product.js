const mongoose = require('mongoose')
const Category = require('./Category')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    require: true,
    index: true
  },
  handle: {
    type: String,
    require: true
  },
  description: {
    type: String,
    index: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [
    {
      id: String,
      src: {
        type: String,
        require: true
      },
      coverSrc: {
        type: String,
        require: true
      },
      thumbSrc: {
        type: String,
        require: true
      },
      alt: String
    }
  ],
  price: {
    type: Number,
    require: true
  },
  compareAt: Number,
  stock: Number,
  hasVariants: {
    type: Boolean,
    default: false
  },
  options: [String],
  variants: [
    {
      values: [String],
      price: Number,
      compareAt: Number,
      stock: Number
    }
  ],
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
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
  }],
  publish: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

productSchema.methods.totalPrice = function (variantId) {
  if (variantId) {
    return this.variants[variantId - 1].price
  } else {
    return this.price
  }
}

productSchema.methods.getVariant = function (variantId) {
  if (variantId && this.hasVariants && variantId <= this.variants.length) {
    return this.variants[variantId - 1]
  }
}

productSchema.methods.categories = function (categoriesIds) {
  if (categoriesIds) {
    return Promise.all(
      categoriesIds.map(
        categoryId => Category.findByIdAndUpdate(categoryId, { $addToSet: { products: this._id } })
      )
    )
  } else {
    // this should be optimized having the categories in the mirrored in the products
    return Category.find({ products: this._id })
  }
}

productSchema.methods.reviewQty = function () {
  if (!this.reviews) return 0
  else return this.reviews.length
}

productSchema.methods.averageReview = function () {
  if (!this.reviews || this.reviews.length === 0) return 0
  const rawAverage = this.reviews.reduce((sum, review) => sum + review.value, 0) / this.reviews.length
  const roundedAverage = Math.round(rawAverage * 10) / 10
  return roundedAverage
}

productSchema.methods.inStock = function () {
  return [null, undefined].includes(this.stock) || this.stock > 0
}

productSchema.methods.cleanDescription = function () {
  return this.description?.replace(/(<([^>]+)>)/ig, '')
}

module.exports = mongoose.model('Product', productSchema)

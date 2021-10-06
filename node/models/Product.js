const mongoose = require('mongoose')
const Category = require('./Category')

const Schema = mongoose.Schema

const images = [
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
]

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
  images,
  price: {
    type: Number,
    require: true
  },
  compareAt: {
    type: Number,
    default: null
  },
  stock: {
    type: Number,
    default: null
  },
  hasVariants: {
    type: Boolean,
    default: false
  },
  options: [String],
  variants: [
    {
      values: [String],
      price: Number,
      compareAt: { 
        type: Number,
        default: null
      },
      stock: { 
        type: Number,
        default: null
      },
      images
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
  sold: {
    type: Number,
    default: 0
  },
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

productSchema.methods.hasImages = function () {
  // The base product might not have images but the variants do.
  return (this.images && this.images.length > 0) ||
    (
      this.hasVariants && this.variants?.flatMap(variant => variant.images || []).length > 0
    )
}

productSchema.methods.getImage = function (variantId) {
  let coverImage = this.images && this.images[0]
  if (variantId && this.hasVariants && this.variants && this.variants[parseInt(variantId) - 1]) {
    const variant = this.variants[parseInt(variantId) - 1]
    if (variant.images && variant.images[0]) {
      coverImage = this.variants[parseInt(variantId) - 1].images[0]
    }
  }
  if (coverImage) return coverImage
  return {
    src: '/assets/no-image.png',
    thumbSrc: '/assets/no-image.png',
    coverSrc: '/assets/no-image.png'
  }
}

productSchema.methods.getCover = function () {
  if (this.images && this.images.length > 0) return this.images[0]
  else {
    if (this.hasVariants && this.variants) {
      // return the first image of the variant
      for (const variant of this.variants) {
        if (variant.images && variant.images > 0) {
          return variant.images[0]
        }
      }
    }
  }
}

// do not call it more than onece, since will duplicate variant indexes
productSchema.methods.allImages = function () {
  // it combines all the images and ads a field 'variants' to add when a variant is selected
  const allImages = []
  for (const image of this.images) { // to get rid of the embeded document list, which prevents from adding new props to the images
    allImages.push(image)
  }
  this.variants?.forEach((variant, variantIndex) => {
    variant.images?.forEach(image => {
      const imageAdded = allImages.find(testImage => testImage.id.toString() === image.id.toString())
      const variantId = variantIndex + 1
      if (imageAdded) {
        if (imageAdded.variants) {
          imageAdded.variants.push(variantId)
        } else {
          imageAdded.variants = [variantId]
        }
      } else {
        image.variants = [variantId]
        allImages.push(image)
      }
    })
  })
  return allImages
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
  return this.stock === null || this.stock > 0
}

productSchema.methods.cleanDescription = function () {
  return this.description?.replace(/(<([^>]+)>)/ig, '')
}

module.exports = mongoose.model('Product', productSchema)

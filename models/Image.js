const mongoose = require('mongoose')

const Schema = mongoose.Schema

const imageSchema = new Schema({
  // all the products that contains the image
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  ],
  name: String,
  // src and alt are storage in the product for increased performance
  src: {
    type: String,
    required: true
  },
  thumbSrc: {
    type: String,
    required: true
  },
  coverSrc: {
    type: String,
    required: true
  },
  alt: String
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

imageSchema.statics.updateProductImages = async function (product, newImageIds) {
  if (!newImageIds) return

  const alreadyIncludedIndex = {} // so the already present images dont have to be fetched again

  // remove the no longer used
  for (const productImage of product.images || []) {
    if (newImageIds.includes(productImage.id)) {
      alreadyIncludedIndex[productImage.id] = productImage
    } else {
      const imageToUpdate = await this.findById(productImage.id)

      // the image does not exist
      if (!imageToUpdate) continue
      imageToUpdate.products = imageToUpdate.products.filter(productId => productId.toString() !== product.id)
      await imageToUpdate.save()
    }
  }

  const toAddImages = []
  for (const newImageId of newImageIds) {
    if (alreadyIncludedIndex[newImageId]) {
      toAddImages.push(alreadyIncludedIndex[newImageId])
    } else {
      const originalImage = await this.findById(newImageId)
      originalImage.products.push(product._id)

      await originalImage.save()
      toAddImages.push({
        id: originalImage.id,
        src: originalImage.src,
        coverSrc: originalImage.coverSrc,
        thumbSrc: originalImage.thumbSrc,
        alt: originalImage.alt
      })
    }
  }

  product.images = toAddImages
  await product.save()
}

imageSchema.statics.updateImagesData = async function (product, newImageIds) {
  // TODO: visit all the products that are using it (using image.products) and update the fields
}

module.exports = mongoose.model('Image', imageSchema)

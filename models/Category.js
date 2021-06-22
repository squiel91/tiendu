const mongoose = require('mongoose')

const Schema = mongoose.Schema

const caregroySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  handle: {
    type: String,
    required: true
  },
  description: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  ],
  // It will be listed in the menu
  listed: {
    type: Boolean,
    default: true
  },
  // It will be listed in the homepeage as a button, right below the subtitle
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

caregroySchema.methods.cleanDescription = function () {
  return this.description?.replace(/(<([^>]+)>)/ig, '')
}

module.exports = mongoose.model('Category', caregroySchema)

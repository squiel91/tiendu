const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customizationSchema = new Schema({
  globalTopMessage: String,
  menu: [
    {
      text: String,
      link: String
    }
  ],
  homeCategories: [{
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    alternativeTitle: String,
  }]
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

module.exports = mongoose.model('Customization', customizationSchema)

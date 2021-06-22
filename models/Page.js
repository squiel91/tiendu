const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pageSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  published: {
    type: Boolean,
    default: false
  },
  handle: {
    type: String,
    require: true
  },
  content: String
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

module.exports = mongoose.model('Page', pageSchema)

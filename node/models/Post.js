const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cover: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
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

module.exports = mongoose.model('post', postSchema)

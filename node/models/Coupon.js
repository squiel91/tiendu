const mongoose = require('mongoose')

const Schema = mongoose.Schema

const couponSchema = new Schema({
  description: String,
  code: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  percentage: Number,
  amount: Number,
  minSpend: Number,
  maxUses: Number,
  timesUsed: {
    type: Number,
    default: 0
  }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

couponSchema.methods.isValid = function () {
  return this.active && (!this.maxUses || this.maxUses > this.timesUsed)
}

module.exports = mongoose.model('Coupon', couponSchema)

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  admin: {
    type: {
      owner: Boolean
    }
  },
  passHash: {
    type: String,
    required: true
  },
  passResetToken: String,
  passResetExp: Date,
  shippment: {
    address: String,
    state: String,
    city: String,
    zip: String
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      variantId: Number
    }
  ]
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

// this HAS to be a function() and not () => {}
userSchema.methods.addToCart = function (productId, quantity, variantId) {
  if (!quantity) quantity = 1

  const cartProductIndex = this.cart.findIndex((elem) => elem.product.toString() === productId.toString() && (!variantId || variantId === elem.variantId))
  if (cartProductIndex >= 0) {
    const item = this.cart[cartProductIndex]
    item.quantity += quantity

    if (item.quantity <= 0) {
      this.cart.splice(cartProductIndex, 1)
    }
  } else {
    if (quantity > 0) {
      this.cart.push({
        product: productId,
        quantity,
        variantId
      })
    }
  }
}

userSchema.methods.getCartQty = function() {
  if (!this.cart || !this.cart) return 0
  return this.cart.reduce((accum, elem) => accum + elem.quantity, 0)
}

module.exports = mongoose.model('User', userSchema)

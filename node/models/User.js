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
      title: { // this is in case the product is deleted, so the user is notified (with its the title)
        type: String,
        required: true
      },
      variantId: Number
    }
  ]
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

// if absolute, the new item quantity is the provided quantity. If not it is added to the previous quantity
userSchema.methods.addToCart = async function (product, quantity, variantId, absolute) {
  const cartProductIndex = this.cart.findIndex((elem) => elem.product.toString() === product.id.toString() && (!variantId || variantId === elem.variantId))
  if (cartProductIndex >= 0) {
    const item = this.cart[cartProductIndex]
    if (absolute) {
      item.quantity = quantity
    } else {
      item.quantity += quantity
    }

    if (item.quantity <= 0) {
      this.cart.splice(cartProductIndex, 1)
    }
  } else {
    if (quantity > 0) {
      this.cart.push({
        product,
        title: product.title,
        quantity,
        variantId
      })
    }
  }
}

userSchema.methods.removeFromCart = function (itemSlims) {
  for (itemSlim of itemSlims) {
    const productId = itemSlim.productId
    const variantId = itemSlim.variantId
    const cartProductIndex = this.cart.findIndex((elem) => elem.product.toString() === productId.toString() && (!variantId || variantId === elem.variantId))
    if (cartProductIndex >= 0) {
      this.cart.splice(cartProductIndex, 1)
    } 
  }
}

userSchema.methods.getCartQuantity = function() {
  if (!this.cart) return 0
  return this.cart.reduce((accum, item) => accum + item.quantity, 0)
}

userSchema.methods.resetCart = function () {
  this.cart = []
  return this.save()
}

module.exports = mongoose.model('User', userSchema)

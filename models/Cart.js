const SessionCart = require('./SessionCart')

class Cart {
  constructor (req) {
    if (req.user) {
      this.user = req.user
    } else {
      this.sessionCart = SessionCart.load(req.session)
    }
  }

  getRaw () {
    if (this.user) {
      return this.user.cart
    } else {
      return this.sessionCart.items
    }
  }

  async get () {
    if (this.user) {
      return new Promise((resolve, reject) => {
        this.user.populate('cart.product').execPopulate()
          .then(populatedUser => {
            let hasPurgedItems = false
            const pupuletedCart = populatedUser.cart
            for (let index = pupuletedCart.length - 1; index >= 0; index--) {
              if (!pupuletedCart[index].product) {
                this.user.cart.splice(index, 1)
                pupuletedCart.splice(index, 1)
                hasPurgedItems = true
              }
            }
            if (hasPurgedItems) {
              this.user.save().then(() => resolve(pupuletedCart))
            } else {
              resolve(pupuletedCart)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    } else {
      return this.sessionCart.getAll()
    }
  }

  getItemsQuantity () {
    if (this.user) {
      return this.user.getCartQty()
    } else {
      return this.sessionCart.getCartQty()
    }
  }

  modifyItems (productId, quantity, variantId) {
    if (this.user) {
      this.user.addToCart(productId, quantity, variantId)
    } else {
      this.sessionCart.addToCart(productId, quantity, variantId)
    }
  }

  save () {
    if (this.user) {
      return this.user.save()
    } else {
      return this.sessionCart.save()
    }
  }

  async reset () {
    if (this.user) {
      this.user.cart = []
      return await this.user.save()
    } else {
      return await this.sessionCart.reset()
    }
  }
}

module.exports = Cart

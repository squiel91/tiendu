const Products = require('./Product')

module.exports = class SessionCart {
  static load (session) {
    return new SessionCart(session ? session.items : [], session)
  }

  constructor (items, session) {
    this.items = items || []
    this.session = session
  }

  save () {
    this.session.items = this.items
    return new Promise((resolve, reject) => {
      this.session.save(() => {
        resolve()
      })
    })
  }

  getAll () {
    const productPromises = []
    const quantities = []
    const variantIds = []
    this.items.forEach(item => {
      productPromises.push(Products.findById(item.product))
      quantities.push(item.quantity)
      variantIds.push(item.variantId)
    })

    // TODO: need to purge variants also
    const toPurgeItems = [] // items that doesn't exist anymore
    return new Promise((resolve, reject) => {
      Promise.all(productPromises)
        .then(products => {
          const cartItems = []
          for (const productIndex in products) {
            const product = products[productIndex]
            if (product) {
              cartItems.push({ product, quantity: quantities[productIndex], variantId: variantIds[productIndex] })
            } else {
              toPurgeItems.push(this.items[productIndex])
            }
          }
          if (toPurgeItems.length > 0) {
            // removing the non existing products
            this.items = this.items.filter(item => !toPurgeItems.includes(item))
            this.save().then(() => resolve(cartItems))
          } else {
            resolve(cartItems)
          }
        })
    })
  }

  getCartQty () {
    if (!this.items) return 0
    return this.items.reduce((accum, item) => accum + item.quantity, 0)
  }

  addToCart (productId, quantity, variantId) {
    if (!quantity) quantity = 1

    const cartProductIndex = this.items.findIndex((elem) => elem.product.toString() === productId.toString() && variantId === elem.variantId)
    if (cartProductIndex >= 0) {
      const item = this.items[cartProductIndex]
      item.quantity += quantity

      if (item.quantity <= 0) {
        this.items.splice(cartProductIndex, 1)
      }
    } else {
      if (quantity > 0) {
        this.items.push({
          product: productId,
          quantity: quantity,
          variantId
        })
      }
    }
  }

  async reset () {
    this.items = []
    if (!this.session.remember) this.session.shippment = undefined
    await this.save()
  }
}

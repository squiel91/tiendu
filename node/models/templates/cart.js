const productTemplate = require('./product')

module.exports = cart => {
  return {
    subtotal: cart.reduce((accum, item) => item.product.price * item.quantity + accum, 0),
    items: cart.map(item => {
      return {
        product: productTemplate(item.product),
        quantity: item.quantity
      }
    })
  }
}

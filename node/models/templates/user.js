const orderTemplate = require('./order');

module.exports = (user, orders) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    cart: user.cart,
    email: user.email,
    admin: user.admin || undefined,
    owner: user.admin?.owner || undefined,
    since: user.created?.toLocaleDateString('es-UY'),
    orders: orders && orders.map(order => orderTemplate(order))
  }
}

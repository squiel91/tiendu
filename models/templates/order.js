module.exports = order => {
  return {
    id: order.id,
    number: order.number,
    paymentMethod: order.paymentMethod,
    billed: order.billed,
    discount: order.discount && {
      id: order.discount.coupon,
      code: order.discount.code,
      description: order.discount.description
    },
    status: order.status,
    personal: { ...order.personal, fullName: `${order.personal.firstName} ${order.personal.lastName}` },
    shipping: order.shipping,
    items: order.items,
    created: order.created.toLocaleDateString('es-UY'),
    createdFull: order.created.toLocaleString('es-UY', { dateStyle: 'full', timeStyle: 'short' })
  }
}

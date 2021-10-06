module.exports = (order, mask) => {
  lastName = mask ? order.personal.lastName.replace(/[^ ]/g, '*') : order.personal.lastName

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
    personal: { 
      firstName: order.personal.firstName,
      lastName,
      email: mask? order.personal.email.split('@')[0].replace(/[^ ]/g, '*') + '@' + order.personal.email.split('@')[1] : order.personal.email,
      phone: mask? order.personal.phone.substring(0, order.personal.phone.length -2).replace(/[^ ]/g, '*') + order.personal.phone.substring(order.personal.phone.length -2) : order.personal.phone,
      idType: mask ? undefined : order.personal.idType,
      idNumber: mask ? undefined : order.personal.idNumber,
      fullName: `${order.personal.firstName} ${lastName}`
    },
    shipping: {
      state: order.shipping.state,
      neighborhood: order.shipping.neighborhood,
      address: mask ? order.shipping.address.replace(/[^ ]/g, '*') : order.shipping.address,
      tracking: order.shipping.tracking
    },
    items: order.items,
    created: order.created.toLocaleDateString('es-UY'),
    prettyCreated: order.prettyCreated(true),
    createdFull: order.created.toLocaleString('es-UY', { dateStyle: 'full', timeStyle: 'short' })
  }
}

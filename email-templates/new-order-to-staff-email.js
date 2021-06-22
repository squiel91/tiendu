exports.subject = (order) => `Nueva Orden de ${order.personal.firstName} ${order.personal.lastName} ($${order.billed})`

exports.body = (order) => `
<h2>${order.personal.firstName} ${order.personal.lastName} realizó una nueva orden por $${order.billed}.</h2>
<p>Mira los detalles en: <a href="https://tiendu.uy/admin/orders/${order.id}">https://tiendu.uy/admin/orders/${order.id}</a></p>
<p>Medio de pago: ${order.paymentMethod}</p>
`

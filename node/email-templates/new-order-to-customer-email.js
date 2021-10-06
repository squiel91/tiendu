exports.subject = (order) => `${order.personal.firstName}, hemos recibido tu orden`

exports.body = (order) => {
  let newOrderEmail = ''
  if (order.status === 'impaga') {
    newOrderEmail = `
    <h2>Paga $${order.billed} en el <span style="text-transform: capitalize;">${order.paymentMethod}</span> más cercano para completar tu compra.</h2>
    <p>Decile al cajero que es un <b>pago para MercadoPago</b> con el <b>número de documento ${order.personal.idNumber}</b>.Tenés hasta 72 horas para realizar el pago, de lo contrario tu orden será cancelada.</p>`
  }
  if (order.status === 'procesando pago') {
    newOrderEmail = `
    <h2>Aún no podemos confirmar tu pago.</h2>
    <p>Aguardaremos la confirmación de la compañia de tu tarjeta, que debería ser a la brevedad. Te informaremos ni bien nos llegue la confirmacón (o rechazo) de pago.</p>`
  }

  if (order.status === 'a confirmar') {
    newOrderEmail = `
    <h2>Tu orden por un total de $${order.billed} ya fue recibida</h2>
    <p>A la brevedad te notificaremos con la confirmación (usualmente 1 a 3 horas) y nos comunicaremos para coordinar el envío.</p>`
  }

  newOrderEmail += `
  <p>Puedes chequear la orden completa siguiente este link: <a href="https://tiendu.uy/ordenes/${order.id}">https://tiendu.uy/ordenes/${order.id}</a></p>
  <p>Te notificaremos a tu email cada vez que tu orden cambie de estado.</p>`

  return newOrderEmail
}
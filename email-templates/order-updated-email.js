exports.subject = (order) => `${order.personal.firstName}, tu orden cambió de estado (a ${order.status})`

const statusExplanation = {
  impaga: 'Aún no hemos recibido el pago de la orden', // The order has been created but not yet paid
  'procesando pago': 'No pudimos confirmar tu pago automáticamente. Es posible que tengamos que esperar unas horas', // The card returned a in_process
  'a confirmar': 'Ya esta todo listo de tu parte. A la brevedad confirmaremos tu orden y la comenzaremos a procesar', // The order has been received but not yet acknoledged
  confirmada: 'Tu orden está confirmada y ya comenzamos a procesarla', // The seller has acknolage it and is processing the order
  pausada: 'Detuvimos el procesamiento de tu orden',
  enviada: 'Tu orden está en camino y lo recibiras muy pronto',
  'lista para retirar': 'Tu orden ya está lista para ser retirada. La dirección de retiro es Circunvalacion Durango 344, apartamento 205.',
  completada: 'Tu orden para este entonces debe haber sido entregada', // The order is completed
  reembolsada: 'Te devolvimos el importe de la orden. Es posible que tengas que esperar hasta 48 horas para verlo reflejado en tu estado de cuenta',
  cancelada: 'Tu orden ha sido cancelada. Si la pagaste y aún no te devolvimos el dinero, comunicate con nosotros'
}

exports.body = (order, prevStatus) => `
<h2>Tu orden cambió a estado "${order.status}"</h2>
<p>${order.status in statusExplanation ? statusExplanation[order.status] : ''}. Puedes consultar la orden y ver la información completa siguiendo link: <a href="https://tiendu.uy/ordenes/${order.id}">https://tiendu.uy/ordenes/${order.id}</a>.
<p>Si tenés alguna duda del cambio de estado no dudes en comunicarte con nosotros.</p>
`

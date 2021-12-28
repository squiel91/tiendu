const validator = require('validator')
const stdRes = require('../../utils/errors')

exports.postCheckout = (req, res, next) => {
  try {
    if (!req.body.contact?.firstName) return stdRes._400(res, 'Falta ingresar tu nombre.')
    req.body.contact.firstName = req.body.contact.firstName.trim()

    if (!req.body.contact?.lastName) return stdRes._400(res, 'Falta ingresar tu apellido.')
    req.body.contact.lastName = req.body.contact.lastName.trim()

    if (!req.body.contact?.email) return stdRes._400(res, 'Falta ingresar tu email.')
    req.body.contact.email = req.body.contact.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.contact.email)) return stdRes._400(res, 'El email parece ser inválido.')

    if (!req.body.contact?.phone) return stdRes._400(res, 'Falta ingresar tu teléfono.')
    req.body.contact.phone = req.body.contact.phone.trim()

    if (!req.body.shipping?.state) return stdRes._400(res, 'Falta seleccionar el departamenteo para el envío.')

    if (!req.body.shipping?.neighborhood) return stdRes._400(res, 'Ingresa un barrio para el envío.')
    req.body.shipping.neighborhood = req.body.shipping.neighborhood.trim()

    if (!req.body.shipping?.address) return stdRes._400(res, 'Ingresa la dirección de envío.')
    req.body.shipping.address = req.body.shipping.address.trim()

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

/* eslint-disable prefer-regex-literals */
const validator = require('validator')

const Product = require('../../models/Product')

const stdRes = require('../../utils/standard-response')

exports.postProductReview = async (req, res, next) => {
  if (!req.user) return stdRes._400(res, 'Necesitas haber iniciado sesión para agregar una reseña')
  if (!req.body.value || (typeof req.body.value) !== 'number' || req.body.value < 1 || req.body.value > 5) {
    return stdRes._400(res, 'value', 'El valor de la reseña debe ser un numero entre 1 y 5')
  }
  next()
}

exports.postCart = async (req, res, next) => {
  try {
    if (!req.body.couponCode) {
      if (!req.body.productId) return stdRes._400(res, 'productId', 'Product Id not valid')

      const productFound = await Product.findOne({ _id: req.body.productId, publish: true })
      if (!productFound) return stdRes._400(res, 'productId', 'Product not found.')

      if (!req.body.quantity) return stdRes._400(res, 'quantity', 'Please enter quantity')
      req.body.quantity = parseInt(req.body.quantity)
    }

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postCheckout = (req, res, next) => {
  try {
    if (!req.body.firstName) return stdRes._400(res, 'firstName', 'Ingresa tu nombre')
    req.body.firstName = req.body.firstName.trim()

    if (!req.body.lastName) return stdRes._400(res, 'lastName', 'Ingresa tu apellido')
    req.body.lastName = req.body.lastName.trim()

    if (!req.body.email) return stdRes._400(res, 'email', 'Ingresa tu email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400(res, 'email', 'Ingresa un email válido')

    if (!req.body.phone) return stdRes._400(res, 'phone', 'Ingresa tu teléfono')

    if (!req.body.neighbourhood) return stdRes._400(res, 'neighbourhood', 'Selecciona un barrio')
    req.body.neighbourhood = req.body.neighbourhood.trim()

    if (!req.body.address) return stdRes._400(res, 'address', 'Ingresa la dirección de envío')
    req.body.address = req.body.address.trim()

    // if (!req.body.token) return stdRes._400(res, 'MercadoPago token not received')

    if (!req.body.freeOrder) {
      if (!req.body.docType) return stdRes._400(res, 'docType', 'Selecciona el tipo de documento')
      if (!req.body.docNumber) return stdRes._400(res, 'docNumber', 'Ingresa el número de documento')
    }

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postSubscribe = (req, res, next) => {
  try {
    if (!req.body.email) return stdRes._400(res, 'email', 'Ingresa tu email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400(res, 'email', 'Ingresa un email válido')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

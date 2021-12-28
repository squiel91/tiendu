const validator = require('validator')
const stdRes = require('../../utils/errors')

exports.postSubscriptions = (req, res, next) => {
  try {
    if (!req.body.email) return stdRes._400(res, 'email', 'Ingresa tu email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400(res, 'email', 'Ingresa un email válido')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}
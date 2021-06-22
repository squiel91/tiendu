const validator = require('validator')

const stdRes = require('../../utils/standard-response')

exports.postRegister = (req, res, next) => {
  try {
    if (req.user) stdRes._400(res, 'Ya estás logueado. Cierra sessión primero')

    if (!req.body.email) return stdRes._400(res, 'email', 'Ingresa tu email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400(res, 'email', 'Ingresa tu email válido')

    if (!req.body.firstName) return stdRes._400(res, 'firstName', 'Ingresa tu nombre')
    req.body.firstName = req.body.firstName.trim()

    if (!req.body.lastName) return stdRes._400(res, 'lastName', 'Ingresa tu apellido')
    req.body.lastName = req.body.lastName.trim()

    const password = req.body.password
    if (!password) return stdRes._400(res, 'password', 'Ingresa una contraseña')
    if (password.length < 6) return stdRes._400(res, 'password', 'La contraseña debe tener al menos 6 carácteres')

    req.body.remember = req.body.remember === true || req.body.remember === 'true'

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postLogin = (req, res, next) => {
  try {
    if (req.user) stdRes._400(res, 'Ya estás logueado. Cierra sessión primero')

    if (!req.body.email) return stdRes._400(res, 'email', 'Ingresa tu email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400(res, 'email', 'Ingresa un email válido')

    if (!req.body.password) return stdRes._400(res, 'password', 'Ingresa una contraseña')
    req.body.remember = req.body.remember === true || req.body.remember === 'true'

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postLogout = async (req, res, next) => {
  try {
    if (!req.user) stdRes._400(res, 'No has iniciado sesión')
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postRequestPasswordReset = async (req, res, next) => {
  try {
    if (!req.body.email) return stdRes._400(res, 'email', 'Ingresa un email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400(res, 'email', 'Ingresa un email válido')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postPasswordReset = async (req, res, next) => {
  try {
    if (!req.body.passResetToken) return stdRes._400(res, 'Envia el token')

    const password = req.body.password
    if (!password) return stdRes._400(res, 'password', 'Ingresa una contraseña')
    if (password.length < 6) return stdRes._400(res, 'password', 'La contraseña debe tener al menos 6 carácteres')
    req.body.remember = req.body.remember === true || req.body.remember === 'true'

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

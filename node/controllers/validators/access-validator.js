const validator = require('validator')

const stdRes = require('../../utils/errors')

exports.postRegister = (req, res, next) => {
  try {
    if (!req.body.email) return res.status(400).json({ error: 'Ingresa tu email' })
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return res.status(400).json({ error: 'Ingresa un email válido' })

    if (!req.body.firstName) return res.status(400).json({ error: 'Ingresa tu nombre' })
    req.body.firstName = req.body.firstName.trim()

    if (!req.body.lastName) return res.status(400).json({ error: 'Ingresa tu apellido' })
    req.body.lastName = req.body.lastName.trim()

    const password = req.body.password
    if (!password) return res.status(400).json({ error: 'Ingresa una contraseña' })
    if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 carácteres' })

    req.body.remember = req.body.remember === true || req.body.remember === 'true'

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postLogin = (req, res, next) => {
  try {
    if (!req.body.email) return res.status(400).json({ error: 'Ingresa tu email' })
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return res.status(400).json({ error: 'Ingresa un email válido' })

    if (!req.body.password) return res.status(400).json({ error: 'Ingresa una contraseña' })
    req.body.remember = req.body.remember === true || req.body.remember === 'true'

    next()
  } catch (error) {
    console.error(error) 
    stdRes._500(res, error.message)
  }
}

exports.postRequestPasswordReset = async (req, res, next) => {
  try {
    if (!req.body.email)
      return res.status(400).json({ error: 'Ingresa un email' })
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) 
      return res.status(400).json({ error: 'Ingresa un email válido' })

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postPasswordReset = async (req, res, next) => {
  try {
    if (!req.body.passResetToken) 
      return res.status(400).json({ error: 'Envia el token' })

    const password = req.body.password
    if (!password)
      return res.status(400).json({ error: 'Ingresa una nueva contraseña' })
    if (password.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 carácteres' })

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

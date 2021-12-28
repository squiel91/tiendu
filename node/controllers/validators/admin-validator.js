const validator = require('validator')

const stdRes = require('../../utils/errors')

exports.postUser = (req, res, next) => {
  try {
    if (!req.body.firstName) return stdRes._400(res, 'firstName', 'Enter your first name')
    req.body.firstName = req.body.firstName.trim()

    if (!req.body.email) return stdRes._400(res, 'email', 'Enter your email')
    req.body.email = req.body.email.trim().toLowerCase()
    if (!validator.isEmail(req.body.email)) return stdRes._400('email', 'Enter a valid email')

    const password = req.body.password
    if (!password) return stdRes._400(res, 'password', 'Please enter a password')
    if (password.length < 6) return stdRes._400(res, 'password', 'The password needs to have 6 or more characters')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

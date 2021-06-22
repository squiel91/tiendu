const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Cart = require('../models/Cart')
const userTemplate = require('../models/templates/user')

const env = require('../utils/env')

const mailer = require('../utils/mailer')
const stdRes = require('../utils/standard-response')

// email templates
const welcomeEmail = require('../email-templates/welcome-email')
const reqPassResetEmail = require('../email-templates/request-password-reset-email')
const passResetEmail = require('../email-templates/password-reset-email')

const login = async (req, user, remember) => {
  const sessionCartItems = (new Cart(req)).getRaw()

  req.session.userId = user.id
  if (!req.body.remember) req.session.cookie.maxAge = false

  req.user = user
  const userCart = new Cart(req)
  const userCartItems = userCart.getRaw()

  let itemAdded = false
  sessionCartItems?.forEach(sessionItem => {
    const foundUserItem = userCartItems?.find(userItem => sessionItem.product === String(userItem.product) && sessionItem.variantId === userItem.variantId)
    if (!foundUserItem || foundUserItem?.quantity < sessionItem.quantity) {
      itemAdded = true
      userCart.modifyItems(sessionItem.product, sessionItem.quantity - (foundUserItem?.quantity || 0), sessionItem.variantId)
    }
  })
  if (itemAdded) await userCart.save()
}

exports.postRegister = async (req, res, next) => {
  try {
    const email = req.body.email
    const firstName = req.body.firstName

    const duplicatedUser = await User.findOne({ email })
    if (duplicatedUser) return stdRes._400(res, 'email', 'Ya existe un usuario con ese email')

    const passHash = await bcrypt.hash(req.body.password, 10)

    let user = new User({
      email,
      firstName,
      lastName: req.body.lastName,
      passHash
    })

    user = await user.save()

    // time to log the user in
    await login(req, user, req.body.remember)

    mailer(user.email, welcomeEmail.subject(user), welcomeEmail.body(user))

    res.json({
      success: true,
      user: userTemplate(user)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return stdRes._400(res, 'email', 'No existe una cuenta con este email')
    const passIsAMatch = await bcrypt.compare(req.body.password, user.passHash)
    if (!passIsAMatch) return stdRes._400(res, 'password', 'La contraseña es incorrecta')

    await login(req, user, req.body.remember)

    res.json({
      success: true,
      user: userTemplate(user)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postLogout = async (req, res, next) => {
  try {
    req.session.destroy()
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postRequestPasswordReset = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return stdRes._400(res, 'email', 'No existe una cuenta con ese email')
    const randomBuffer = crypto.randomBytes(32) // Can be done async, but this method is rearely accessed
    const token = randomBuffer.toString('hex')
    user.passResetToken = token
    user.passResetExp = Date.now() + 3600000 // 1 hour expiration

    await user.save()
    const urlHead = req.protocol + '://' + req.get('host')
    await mailer(user.email, reqPassResetEmail.subject(), reqPassResetEmail.body(token, urlHead))
    return res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postPasswordReset = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passResetToken: req.body.passResetToken,
      passResetExp: { $gt: Date.now() }
    })
    if (!user) return res.status(400).json({ error: true, message: 'El token es inválido o ha expirado' })
    const passHash = await bcrypt.hash(req.body.password, 10)
    user.passHash = passHash
    user.passResetToken = undefined
    user.passResetExp = undefined
    await user.save()
    res.json({ success: true, email: user.email })
    mailer(user.email, passResetEmail.subject(), passResetEmail.body())
  } catch (error) { stdRes._500(res, error.message) }
}

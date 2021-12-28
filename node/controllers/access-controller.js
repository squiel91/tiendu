// TODO: This controller needs to be merged with the User controller,
// and common functions such as authenticate or is isAdmin moved to a helper

const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Order = require('../models/Order')
const Product = require('../models/Product')
const userTemplate = require('../models/templates/user')

const env = require('../utils/env')

const jwt = require('jsonwebtoken')

const mailer = require('../utils/mailer')
const stdRes = require('../utils/errors')

// email templates
const welcomeEmail = require('../email-templates/welcome-email')
const reqPassResetEmail = require('../email-templates/request-password-reset-email')
const passResetEmail = require('../email-templates/password-reset-email')

const login = async (user, remoteItems) => {
  let itemAdded = false
  for (remoteItem of remoteItems) {
    const foundUserItem = (user.cart || []).find(userItem => remoteItem.productId === userItem.product.toString() && remoteItem.variantId === userItem.variantId)
    if (!foundUserItem || foundUserItem.quantity < remoteItem.quantity) {
      const product = await Product.findOne({ _id: remoteItem.productId, publish: true })
      if (product && (!remoteItem.variantId && !product.hasVariants) || (remoteItem.variantId && product.hasVariants && remoteItem.variantId <= product.variants.length)) {
        user.addToCart(product, remoteItem.quantity, remoteItem.variantId, true)
        itemAdded = true
      } else {
        console.warn(`${foundUserItem} no agregado al carrito del usuario.`)
      }
    }
  }

  if (itemAdded) await user.save()
  return jwt.sign({ id: user.id }, env.JWT_SECRET)
}


exports.getAccount = async (req, res, next) => {
  if (req.user) {
    const orders = await Order.find({ user: req.user })
    res.json({
      user: userTemplate(req.user, orders)
    })
  } else {
    return res.status(400).json({
      error: 'Debes de estar autenticado'
    })
  }
}

exports.postRegister = async (req, res, next) => {
  try {
    const email = req.body.email
    const firstName = req.body.firstName

    const duplicatedUser = await User.findOne({ email })
    if (duplicatedUser) return res.status(400).json({
      error: 'Ya existe un usuario con ese email' }
    )

    const passHash = await bcrypt.hash(req.body.password, 10)
    const firstUser = await User.countDocuments() === 0

    let user = new User({
      email,
      firstName,
      lastName: req.body.lastName,
      passHash,
      admin: firstUser ? { owner: true } : undefined,
    })

    user = await user.save()

    // time to log the user in
    const token = await login(user, req.body.cartItems)

    mailer(user.email, welcomeEmail.subject(user), welcomeEmail.body(user))

    res.json({
      token,
      user: userTemplate(user),
      cartQty: user.getCartQuantity()
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postLogin = async (req, res, next) => {
  // try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({
      error: 'No existe una cuenta con este email'
    })
    const passIsAMatch = await bcrypt.compare(req.body.password, user.passHash)
    if (!passIsAMatch) return res.status(400).json({
      error: 'La contraseña es incorrecta'
    })

    const token = await login(user, req.body.cartItems)
    
    res.json({
      token,
      user: userTemplate(user),
      cartQty: user.getCartQuantity()
    })
  // } catch (error) { stdRes._500(res, error.message) }
}

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')
  if (!token) return next() // is not authenticated

  let payload
  try {
    payload = jwt.verify(token, env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) throw new Error('Claimed user not found')
    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({
      error: {
        code: 'INVALID_AUTH_TOKEN',
        message: 'Invalid Auth Token'
      }
    })
  }
}

exports.isUser = (req, res, next) => {
  if (!req.user) return res.status(403).json({
    error: 'No tiene permisos suficientes'  
  })
  next()
}


exports.isAdmin = async (req, res, next) => {
  if (!req.user || !req.user.admin) return res.status(403).json({
    error: 'No tiene permisos suficientes'  
  })
  next()
}

exports.isOwner = async (req, res, next) => {
  if (!req.user || !req.user.admin || !req.user.admin.owner) return res.status(403).json({
    error: 'No tiene permisos suficientes'  
  })
  next()
}

exports.postRequestPasswordReset = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({
      error: 'No existe una cuenta con ese email'
    })
    const randomBuffer = crypto.randomBytes(32) // Can be done async, but this method is rearely accessed
    const token = randomBuffer.toString('hex')
    user.passResetToken = token
    user.passResetExp = Date.now() + 3600000 // 1 hour expiration

    await user.save()
    const urlHead = req.protocol + '://' + req.get('host')
    await mailer(user.email, reqPassResetEmail.subject(), reqPassResetEmail.body(token, urlHead))
    return res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postPasswordReset = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passResetToken: req.body.passResetToken,
      passResetExp: { $gt: Date.now() }
    })
    if (!user) return res.status(400).json({ error: 'El token es inválido o ya ha expirado' })
    const passHash = await bcrypt.hash(req.body.password, 10)
    user.passHash = passHash
    user.passResetToken = undefined
    user.passResetExp = undefined
    await user.save()
    res.json({
      email: user.email
    })
    mailer(user.email, passResetEmail.subject(), passResetEmail.body())
  } catch (error) { stdRes._500(res, error.message) }
}

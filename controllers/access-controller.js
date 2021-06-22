const Order = require('../models/Order')
const Category = require('../models/Category')
const User = require('../models/User')

const Cart = require('../models/Cart')
const env = require('../utils/env')

exports.setupAuth = async (req, res, next) => {
  try {
    // res.locals.csrfToken = env.isDev ? 'disabled in development' : req.csrfToken()
    res.locals.csrfToken = 'WfF1szMUHhiokx9AHFply5L2xAOfjRkE'

    if (req.session.userId) {
      req.user = await User.findById(req.session.userId)
      res.locals.user = req.user
    }
    req.cart = new Cart(req)
    res.locals.cartItemQty = req.cart.getItemsQuantity()

    res.locals.domain = `${req.protocol}://${req.get('host')}` // TOFIX: Not showing HTTPS
    res.locals.url = `${res.locals.domain}${req.originalUrl}`

    res.locals.listedCategories = await Category.find({ listed: true })
    res.locals.featuredCategories = await Category.find({ featured: true })

    res.locals.shouldUseAnalytics = env.isProd

    next()
  } catch (error) { next(error) }
}

exports.getRegister = (req, res, next) => {
  try {
    if (req.user) res.redirect('/cuenta')
    res.render('access/register.ejs', {
      prefillEmail: req.query.email,
      prefillFirstName: req.query.firstName,
      prefillLastName: req.query.lastName,
      redirect: req.query.redirect,
      title: 'registrate'
    })
  } catch (error) { next(error) }
}

exports.getLogin = (req, res, next) => {
  try {
    if (req.user) res.redirect('/cuenta')
    res.render('access/login.ejs', { prefillEmail: req.query.email, redirect: req.query.redirect, title: 'ingresa' })
  } catch (error) { next(error) }
}

exports.getAccount = async (req, res, next) => {
  try {
    if (!req.user) res.redirect('/cuenta/ingresar')

    // retrive user orders
    const orders = await Order.find({ user: req.user })
    res.render('store/account.ejs', { orders, title: 'tu cuenta' })
  } catch (error) { next(error) }
}

exports.getRequestPasswordReset = (req, res, next) => {
  try {
    res.render('access/request-password-reset.ejs')
  } catch (error) { next(error) }
}

exports.getPasswordReset = async (req, res, next) => {
  try {
    const passResetToken = req.params.resetToken
    res.render('access/password-reset.ejs', { passResetToken })
  } catch (error) { next(error) }
}
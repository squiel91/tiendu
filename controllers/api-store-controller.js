/* eslint-disable no-unused-vars */
// eslint-disable-next-line camelcase

const mercadopago = require('mercadopago')

const env = require('../utils/env')
const mailer = require('../utils/mailer')
const reviewSubmittedEmail = require('../email-templates/review-submitted-staff')

mercadopago.configurations.setAccessToken(env.MERCADOPAGO_ACCESS_TOKEN)
// models
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Coupon = require('../models/Coupon')
const User = require('../models/User')
const Category = require('../models/Category')
const Review = require('../models/Review')
const Product = require('../models/Product')
const Page = require('../models/Page')
const Subscription = require('../models/Subscription')

// templates
const orderTemplate = require('../models/templates/order')
const cartTemplate = require('../models/templates/cart')
const productTemplate = require('../models/templates/product')
const categoryTemplate = require('../models/templates/category')
const couponTemplate = require('../models/templates/coupon')
const pageTemplate = require('../models/templates/page')

const stdRes = require('../utils/standard-response')

const staffNewOrderEmail = require('../email-templates/new-order-to-staff-email')
const customerNewOrderEmail = require('../email-templates/new-order-to-customer-email')

const neighbourhoodCodes = require('../utils/neighbourhood-codes')
const session = require('express-session')

exports.customerSetup = async (req, res, next) => {
  // is required to load the user into the request before initalizing the cart
  if (req.session.userId) req.user = await User.findById(req.session.userId)
  req.cart = new Cart(req)
  next()
}

// get products - DEPRECATED
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ publish: true })

    res.json({
      success: true,
      products: products?.map(product => productTemplate(product))
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// get product - DEPRECATED
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      publish: 'true'
    })

    if (product) return stdRes._400(res, 'Product not found')

    res.json({
      success: true,
      product: productTemplate(product)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// get categories (not populated with it's products) - DEPRECATED
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()

    res.json({
      success: true,
      category: categories?.map(category => categoryTemplate(category))
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// get category (populated with it's products) - DEPRECATED
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      handle: req.params.categoryHandle
    }).populate('products')

    if (category) return stdRes._400(res, 'Category not found')

    res.json({
      success: true,
      category: categoryTemplate(category)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// get pages - DEPRECATED
exports.getPages = async (req, res, next) => {
  try {
    const pages = await Page.find()

    res.json({
      success: true,
      page: pages?.map(page => pageTemplate(page))
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// get page - DEPRECATED
exports.getPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ _id: req.params.pageId })

    if (page) return stdRes._400(res, 'Page not found')

    res.json({
      success: true,
      page: pageTemplate(page)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// Post Cart
exports.postCart = async (req, res, next) => {
  try {
    if (req.body.couponCode) {
      if (req.body.couponCode !== '---BORRAR---') {
        const coupon = await Coupon.findOne({ code: req.body.couponCode?.toUpperCase() })
        if (coupon?.isValid()) {
          res.json({
            success: true,
            coupon: couponTemplate(coupon)
          })
          req.session.coupon = coupon
          req.session.save()
        } else {
          res.json({
            success: true,
            error: 'El cupón es invalido o está inactivo'
          })
        }
      } else {
        req.session.coupon = undefined
        req.session.save()
        res.json({
          success: true
        })
      }
    } else {
      req.cart.modifyItems(req.body.productId, req.body.quantity, req.body.variantId)
      await req.cart.save()
      const cart = await req.cart.get()
      res.json({
        success: true,
        cart: cartTemplate(cart)
      })
    }
  } catch (error) { 
    console.error(error)
    stdRes._500(res, error.message)
  }
}

exports.postProductReview = async (req, res, next) => {
  const product = await Product.findOne({ handle: req.params.productHandle })
  if (!product) return stdRes._400(res, 'Producto no encontrado')

  const user = req.user
  const value = req.body.value
  const comment = req.body.comment
  // TODO: check if the user has bought the product and add a mark
  // TODO: add an optional image to the reviews
  await Review.set({
    user,
    product,
    value,
    comment
  })

  mailer(
    env.ADMIN_EMAILS,
    reviewSubmittedEmail.subject(user),
    reviewSubmittedEmail.body(user, product, value, comment)
  )

  res.json({ success: true })
}

exports.postCheckout = async (req, res, next) => {
  try {
    const cart = await req.cart.get()
    if (!cart || cart.length === 0) return stdRes._400(res, 'Tu carrito está vacío')

    let coupon
    let billed = cart.reduce((accum, item) => item.product.totalPrice(item.variantId) * item.quantity + accum, 0)
    if (req.session.coupon) {
      coupon = await Coupon.findOne({ code: req.session.coupon.code })
      if (!coupon || !coupon.isValid()) return stdRes._400(res, 'El cupón es invalido o está inactivo')

      billed = coupon.percentage ? billed * (1 - (coupon.percentage / 100)) : Math.max(0, billed - coupon.amount)
    }

    let MPstatus
    let paymentMethod
    if (billed > 0) {
      paymentMethod = req.body.paymentMethod
      let paymentData
      let paymentStatus

      if (paymentMethod === 'card') {
        paymentData = {
          transaction_amount: billed,
          token: req.body.token,
          description: req.body.description,
          installments: Number(req.body.installments),
          payment_method_id: req.body.paymentMethodId,
          issuer_id: req.body.issuer || undefined,
          payer: {
            email: req.body.email,
            identification: {
              type: req.body.docType,
              number: req.body.docNumber
            }
          }
        }
        paymentStatus = await mercadopago.payment.save(paymentData)
      } else {
        // Is Abitab or Redpagos
        paymentData = {
          transaction_amount: billed,
          description: req.body.description,
          payment_method_id: paymentMethod,
          payer: {
            email: req.body.email,
            identification: {
              type: req.body.docType,
              number: req.body.docNumber
            }
          }
        }

        paymentStatus = await mercadopago.payment.create(paymentData)
      }

      if (paymentStatus.body.status === 'rejected') {
        const rejectedMessages = {
          cc_rejected_bad_filled_card_number: 'Revisa el número de tarjeta.',
          cc_rejected_bad_filled_date: 'Revisa la fecha de vencimiento de la tarjeta.',
          cc_rejected_bad_filled_other: 'Revisa los datos de la tarjeta.',
          cc_rejected_bad_filled_security_code: 'Revisa el código de seguridad de la tarjeta.',
          cc_rejected_blacklist: 'No pudimos procesar tu pago.',
          cc_rejected_call_for_authorize: 'Debes comunicarte con la compañía de tu tarjeta para autorizar el pago del total de la orden.',
          cc_rejected_card_disabled: 'Llama a a la compañia de tu tarjeta para activar tu tarjeta o usa otro medio de pago.',
          cc_rejected_card_error: 'No pudimos procesar tu pago.',
          cc_rejected_duplicated_payment: 'Ya hiciste un pago por ese valor. Si necesitas volver a pagar usa otra tarjeta u otro medio de pago.',
          cc_rejected_high_risk: 'Tu pago fue rechazado. Elige otro de los medios de pago.',
          cc_rejected_insufficient_amount: 'Tu tarjeta no tiene fondos suficientes.',
          cc_rejected_invalid_installments: 'Tu tarjeta no permite pagar en cuotas.',
          cc_rejected_max_attempts: 'Llegaste al límite de intentos permitidos. Elige otra tarjeta u otro medio de pago.',
          cc_rejected_other_reason: 'Tu compañía de tarjeta no procesó el pago.'
        }

        const statusDetail = paymentStatus.body.status_detail
        return stdRes._400(res, statusDetail in rejectedMessages ? rejectedMessages[statusDetail] : 'cc_rejected_card_error')
      }

      MPstatus = paymentStatus.body.status

      // status approved for card or pending for payment network
    } else {
      paymentMethod = 'free'
      MPstatus = 'approved'
    }

    const updateStock = true && (billed === 0 || MPstatus === 'approved')
    const orderProducts = []
    const stockUpdatePromises = []

    // TODO: add a cover image here
    cart.forEach((item) => {
      orderProducts.push({
        originalProduct: item.product._id,
        handle: item.product.handle,
        title: item.product.title,
        variant: item.product.getVariant(item.variantId)?.values?.join(', '),
        unitPrice: item.product.totalPrice(item.variantId),
        quantity: item.quantity
      })

      // EZE: see what happens here when the stock is not set
      // reduce the number of stock (if there is a -1 then you inform to the staff)
      if (updateStock) {
        stockUpdatePromises.push(Product.findByIdAndUpdate(item.product.id, { $inc: { stock: -item.quantity } }))
      }
    })

    const order = new Order({
      paymentMethod,
      user: req.user ? req.user : undefined,
      status: paymentMethod === 'card' || paymentMethod === 'free' ? (MPstatus === 'approved' ? 'a confirmar' : 'procesando pago') : 'impaga',
      billed,
      discount: coupon ? {
        coupon,
        code: coupon.code,
        description: coupon.description,
      } : undefined,
      personal: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        idType: req.body.docType,
        idNumber: req.body.docNumber,
      },
      shipping: {
        state: req.body.state,
        neighbourhood: req.body.neighbourhood,
        address: req.body.address
      },
      items: orderProducts
    })

    if (updateStock) {
      await stockUpdatePromises
    }

    await order.save()
    await req.cart.reset()

    if (coupon) {
      coupon.timesUsed += 1
      await coupon.save()
      req.session.save()
      req.session.coupon = undefined
    }

    mailer(
      env.ADMIN_EMAILS,
      staffNewOrderEmail.subject(order),
      staffNewOrderEmail.body(order)
    )
    mailer(
      req.body.email,
      customerNewOrderEmail.subject(order),
      customerNewOrderEmail.body(order)
    )
    res.json({
      success: true,
      order: orderTemplate(order)
    })
  } catch (error) {
    console.error('error', error)
    stdRes._500(res, error.message)
  }
}

exports.postSubscribe = async (req, res, next) => {
  try {
    const email = req.body.email
    const duplicateEmail = await Subscription.findOne({ email })
    if (duplicateEmail) return stdRes._400(res, 'email', '¡Ya estas suscripto!')
    const subscriptor = new Subscription({ email })
    await subscriptor.save()
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getCustomersExist = async (req, res, next) => {
  try {
    const email = req.query.email
    const customer = await User.findOne({ email })
    res.json({
      success: true,
      exist: customer !== null
    })
  } catch (error) { stdRes._500(res, error.message) }
}
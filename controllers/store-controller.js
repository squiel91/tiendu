/* eslint-disable func-call-spacing */
// const stripe = require('stripe')('sk_test_*******')
const mongoose = require('mongoose')
const { stripHtml } = require('string-strip-html')

const Product = require('../models/Product')
const Page = require('../models/Page')
const Category = require('../models/Category')
const Review = require('../models/Review')
const Order = require('../models/Order')
const neighbourhoodCodes = require('../utils/neighbourhood-codes')
const env = require('../utils/env')

function filterOutUnpublishedProducts (category) {
  category.products = category.products.filter(product => product.publish)
}

// get hompage
const ITEMS_TO_SHOW = 6

exports.getHomepage = async (req, res, next) => {
  try {
    // all these can be done more efficiently using only mongo groups
    const featuredProducts = await Product.find({ featured: true, publish: true }).limit(ITEMS_TO_SHOW)

    // eslint-disable-next-line no-undef
    const homepageCategoryRawList = PREFERENCES.homepage?.categories || []
    const homepageCategoryIds = homepageCategoryRawList.map(homepageCategoryItem => mongoose.Types.ObjectId(homepageCategoryItem.id))

    const homepageCategoryList = await Category.find(
      { _id: { $in: homepageCategoryIds } }
    ).populate({
      path: 'products',
      match: { publish: true },
      options: { limit: ITEMS_TO_SHOW }
    })

    const homepageCategories = []
    homepageCategoryRawList.forEach(rawItem => {
      const homepageCategory = homepageCategoryList.find(category => category.id === rawItem.id)
      if (homepageCategory) {
        homepageCategories.push({
          category: homepageCategory,
          altTitle: rawItem.altTitle
        })
      }
    })

    const reviews = await Review.find().sort({ created: -1 }).where('comment').ne(null).limit(6)

    res.render('store/homepage.ejs', { featuredProducts, reviews, neighbourhoodCodes, homepageCategories, title: 'plantas online en Uruguay' })
  } catch (error) { next(error) }
}

// get categories listing
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('products')
    categories.forEach(category => filterOutUnpublishedProducts(category))
    res.render('store/categories.ejs', { categories, title: 'todas las categorías' })
  } catch (error) { next(error) }
}

// get category details
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      handle: req.params.categoryHandle
    }).populate('image').populate('products')
    if (!category) return next()
    filterOutUnpublishedProducts(category)
    const order = req.query.orden
    if (order === 'precio') {
      category.products = category.products.sort((prodA, prodB) => prodA.price < prodB.price ? -1 : 1)
    }
    if (order === 'nombre') {
      category.products = category.products.sort((prodA, prodB) => prodA.title < prodB.title ? -1 : 1)
    }
    res.render('store/category.ejs', {
      category,
      hasDescription: category.description && stripHtml(category.description).result,
      title: category.title,
      order
    })
  } catch (error) { next(error) }
}

// get product details
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ handle: req.params.productHandle, publish: true })
    if (!product) return next()

    const categoryHandle = req.query.from
    let fromCategory

    if (categoryHandle) {
      fromCategory = await Category.findOne({ handle: categoryHandle })
    }

    const recommendedProducts = await Product.find({ _id: { $ne: product._id }, publish: true }).limit(4)

    res.render('store/product.ejs', {
      product,
      recommendedProducts,
      fromCategory,
      variantIndex: product.hasVariants && req.query.variante ? parseInt(req.query.variante) : undefined,
      title: product.title
    })
  } catch (error) { next(error) }
}

// get cart details
exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.cart.get()
    // in case the cart changed
    res.locals.cartItemQty = req.cart.getItemsQuantity()

    res.render('store/cart.ejs', {
      cart,
      itemsPrice: cart.reduce((accum, item) => item.product.price * item.quantity + accum, 0),
      title: 'carrito',
      coupon: req.session.coupon
    })
  } catch (error) { next(error) }
}

// get shipping form
exports.getCheckout = async (req, res, next) => {
  try {
    // Check if the user has at least one product
    if (!(req.cart?.getItemsQuantity() > 0)) return res.redirect('/carrito')

    const cart = await req.cart.get()
    const subtotal = cart.reduce((accum, item) => item.product.totalPrice(item.variantId) * item.quantity + accum, 0)
    let subtotalDiscounted
    const coupon = req.session.coupon
    if (coupon) {
      subtotalDiscounted = coupon.percentage ? subtotal * (1 - (coupon.percentage / 100)) : Math.max(0, subtotal - coupon.amount)
    }
    const publicKey = env.MERCADOPAGO_PUBLIC_KEY
    res.render(`store/checkout-${PREFERENCES.paymentGateway || 'stripe'}.ejs`, { neighbourhoodCodes, publicKey, subtotal, subtotalDiscounted, cart, title: 'checkout' })
  } catch (error) { next(error) }
}

// get shipping form
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId })
    if (!order) next()
    const owner = order.user && req.user && String(order.user) === req.user.id
    res.render('store/order.ejs', { order, mensaje: req.query.mensaje, fromAccount: req.query.from === 'account', owner, title: 'Orden' })
  } catch (error) { next(error) }
}

// get page details
exports.getPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ handle: req.params.pageHandle })
    if (page) res.render('store/page.ejs', { page, title: page.title })
    else next()
  } catch (error) { next(error) }
}

// get search listing
exports.getSearch = async (req, res, next) => {
  try {
    const query = req.query.q

    const search = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }

    let results = await Product.find(search)

    const order = req.query.orden
    if (order === 'precio') {
      results = results.sort((prodA, prodB) => prodA.price < prodB.price ? -1 : 1)
    }
    if (order === 'nombre') {
      results = results.sort((prodA, prodB) => prodA.title < prodB.title ? -1 : 1)
    }

    res.render('store/search.ejs', {
      query,
      products: results,
      title: 'busqueda',
      order
    })
  } catch (error) { next(error) }
}

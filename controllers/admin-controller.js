const fs = require('fs')

const Product = require('../models/Product')
const Page = require('../models/Page')
const Order = require('../models/Order')
const Category = require('../models/Category')
const rootPath = require('../utils/root-path')
const prefills = require('../utils/prefills')
const User = require('../models/User')
const Coupon = require('../models/Coupon')

// General
exports.getDashboard = async (req, res, next) => {
  try {
    const newOrders = await Order.find({ status: { $in: ['a confirmar', 'impaga', 'procesando pago'] } })
    res.render('admin/dashboard.ejs', { newOrders, tab: 'dashboard' })
  } catch (error) { next(error) }
}

// Customize
exports.getCustomize = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.render('admin/customize.ejs', { categories, tab: 'customize' })
  } catch (error) { next(error) }
}

// TODO: send it to API
exports.postCustomize = (req, res, next) => {
  try {
    // global variable
    PREFERENCES = {
      storeName: req.body.storeName,
      globalMessage: req.body.globalMessage,
      paymentGateway: req.body.paymentGateway,
      headerMenu: req.body.headerMenuText?.map((text, index) => {
        return {
          text: text,
          link: req.body.headerMenuLink[index],
          classes: req.body.headerMenuClasses[index]
        }
      }),
      homepage: {
        title: req.body.homepageTitle
      },
      footerMenu: req.body.footerMenuText?.map((text, index) => {
        return {
          text: text,
          link: req.body.footerMenuLink[index],
          classes: req.body.footerMenuClasses[index]
        }
      }),
      footerMessage: req.body.footerMessage
    }

    const homepageCategoryIds = req.body.homepageCategory
    const homepageCategoryAltTitle = req.body.homepageCategoryAltTitle

    if (homepageCategoryIds) {
      PREFERENCES.homepage.categories = []
      homepageCategoryIds.forEach((categoryId, index) => {
        PREFERENCES.homepage.categories.push({
          id: categoryId,
          altTitle: homepageCategoryAltTitle[index] || undefined
        })
      })
    }

    fs.writeFileSync(rootPath('data', 'preferences.json'), JSON.stringify(PREFERENCES))
    res.redirect('/admin/customize')
  } catch (error) { next(error) }
}

// Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.render('admin/categories.ejs', { categories, tab: 'categories' })
  } catch (error) { next(error) }
}

exports.getNewCategory = async (req, res, next) => {
  try {
    const products = await Product.find()
    res.render('admin/category.ejs', { category: null, products, tab: 'categories' })
  } catch (error) { next(error) }
}

exports.getEditCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.categoryId }).populate('image')
    const allProducts = await Product.find()
    res.render('admin/category.ejs', { category, products: allProducts, tab: 'categories' })
  } catch (error) { next(error) }
}

// Products
const ITEMS_PER_PAGE = 10

// TODO: make it scalable with a mongoose plugin or just use mongoose paginate
// paginate = model => {
//   promise = new Promise((resolve, reject) => {
//     model.find().countDocuments()
//       .then(numProducts => {
//         this.paginate = {
//           perPage: ITEMS_PER_PAGE,
//           pageCount: Math.ceil(numProducts / ITEMS_PER_PAGE),
//           itemsCount: numProducts,
//           currentPage: page
//         }
//         resolve(model.find()
//           .skip((page - 1) * ITEMS_PER_PAGE)
//           .limit(ITEMS_PER_PAGE))
//       })
//       .catch(error => {
//         reject(error)
//       })
//   })
// }

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1)
    const numProducts = await Product.find().countDocuments()
    const paginate = {
      perPage: ITEMS_PER_PAGE,
      pageCount: Math.ceil(numProducts / ITEMS_PER_PAGE),
      itemsCount: numProducts,
      currentPage: page
    }
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    res.render('admin/products.ejs', { products, paginate, tab: 'products' })
  } catch (error) { next(error) }
}

exports.getCreateProduct = async (req, res, next) => {
  try {
    const allCategories = await Category.find()
    const prefill = prefills.retrive(req);
    (prefill._returnStatus ? res.status(prefill._returnStatus) : res).render('admin/product.ejs', {
      prefill,
      product: undefined,
      allCategories,
      tab: 'products'
    })
  } catch (error) { next(error) }
}

exports.getEditProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId)
    const allCategories = await Category.find()
    const prefill = prefills.retrive(req);
    (prefill._returnStatus ? res.status(prefill._returnStatus) : res).render('admin/product.ejs', {
      prefill,
      product: product,
      allCategories: allCategories,
      tab: 'products'
    })
  } catch (error) { next(error) }
}

// Groups
exports.getCreateGroup = async (req, res, next) => {
  try {
    res.render('admin/group.ejs')
  } catch (error) { next(error) }
}

exports.getEditGroup = async (req, res, next) => {
  try {
    res.render('admin/group.ejs')
  } catch (error) { next(error) }
}

// Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
    res.render('admin/orders.ejs', { orders, tab: 'orders' })
  } catch (error) { next(error) }
}

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
    res.render('admin/order.ejs', { order, tab: 'orders' })
  } catch (error) { next(error) }
}

// Users
exports.getUsers = async (req, res, next) => {
  try {
    const customers = await User.find({ admin: null })
    const admins = await User.find({ admin: { $ne: null } })
    res.render('admin/users.ejs', { admins, customers, tab: 'users' })
  } catch (error) { next(error) }
}

// Pages
exports.getPages = async (req, res, next) => {
  try {
    const pages = await Page.find()
    res.render('admin/pages.ejs', { pages, tab: 'pages' })
  } catch (error) { next(error) }
}

exports.getPageCreation = (req, res, next) => {
  try {
    res.render('admin/page.ejs', { tab: 'users' })
  } catch (error) { next(error) }
}

exports.getPageEdition = async (req, res, next) => {
  try {
    const pageId = req.params.pageId
    const page = await Page.findById(pageId)
    if (page) {
      res.render('admin/page.ejs', { page, tab: 'pages' })
    } else {
      console.error(`Page with the id ${pageId} not found`)
      next()
    }
  } catch (error) { next(error) }
}

// Marketing
exports.getMarketing = async (req, res, next) => {
  try {
    res.render('admin/marketing.ejs', { tab: 'marketing' })
  } catch (error) { next(error) }
}

exports.getCreateCoupon = (req, res, next) => {
  try {
    res.render('admin/coupon.ejs', { tab: 'marketing' })
  } catch (error) { next(error) }
}

exports.getEditCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId
    const coupon = await Coupon.findById(couponId)
    if (coupon) {
      res.render('admin/coupon.ejs', { coupon, tab: 'marketing' })
    } else {
      console.error(`Page with the id ${couponId} not found`)
      next()
    }
  } catch (error) { next(error) }
}

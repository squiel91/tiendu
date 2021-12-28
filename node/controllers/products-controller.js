const Product = require('../models/Product')
const Review = require('../models/Review')
const Category = require('../models/Category')
const Image = require('../models/Image')

const productTemplate = require('../models/templates/product')
const reviewTemplate = require('../models/templates/review')

const mailer = require('../utils/mailer')
const reviewSubmittedEmail = require('../email-templates/review-submitted-staff')

const env = require('../utils/env')
const stdRes = require('../utils/errors')

// by id or handle
const findBy = (handle, productId) => {
  if (handle) {
    return Product.findOne({ handle: productId })
  } else {
    return Product.findById(productId)
  }
}

exports.getProduct = async (req, res, next) => {
  try {
    const product = await findBy(req.query.handle, req.params.productId)

    if (!product) return res.status(404).json({
      message: 'Product not found'
    })

    if (!product.publish && !req.user?.admin) {
      return res.status(401).json({
        message: 'Unauthorized access (only admin can access unpublished products)'
      })
    }

    res.json({
      product: productTemplate(product, req.user)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getProducts = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage) : 6

    const filter = {}
    if (req.query.publishedOnly || !req.user?.admin) {
      filter.publish = true
    }

    const query = req.query.q
    if (query) {
      filter['$or'] = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }

    const itemsCount = await Product.find(filter).countDocuments()

    const withPagination = req.query.all?.toLowerCase() !== 'true'

    let products
    if (withPagination) {
      products = await Product.find({ ...filter, ...(req.query.featured ? { featured: true } : {}) })
        .sort({ updated: -1 })
        .limit(itemsPerPage)
        .skip((page - 1) * itemsPerPage)
    } else {
      products = await Product.find({ ...filter, ...(req.query.featured ? { featured: true } : {}) }).sort({ updated: -1 })
    }

    res.json({
      products: products?.map(product => productTemplate(product)),
      pagination: withPagination ? {
        items: itemsCount,
        pages: Math.ceil(itemsCount / itemsPerPage),
        current: page,
        from: itemsPerPage * (page - 1) + 1,
        to: Math.min(itemsCount, itemsPerPage * page),
        hasNext: itemsPerPage * page < itemsCount,
        hasPrev: page > 1
      } : undefined
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getReviews = async (req, res, next) => {
  try {
    const totalReviews = await Review.countDocuments() 
    const reviews = await Review.find().sort({ created: -1 }).where('comment').ne(null).limit(8)

    res.json({
      total: totalReviews,
      reviews: reviews.map(review => reviewTemplate(review))
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postProduct = async (req, res, next) => {
  try {
    let product = new Product({
      title: req.body.title,
      handle: req.body.handle,
      description: req.body.description,
      price: req.body.price,
      compareAt: req.body.compareAt,
      stock: req.body.stock,
      hasVariants: req.body.hasVariants === true,
      featured: req.body.featured,
      publish: req.body.listed
    })

    if (product.hasVariants) {
      product.options = req.body.options
      product.variants = req.body.variants
    }

    product = await product.save()
    await product.categories(req.body.categories)
    await Image.updateProductImages(product, req.body.images)

    res.json({
      product: productTemplate(product)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId
    const product = await Product.findById(productId)

    product.title = req.body.title
    product.handle = req.body.handle
    product.price = req.body.price
    product.compareAt = req.body.compareAt
    product.stock = req.body.stock
    product.hasVariants = req.body.hasVariants === true
    product.description = req.body.description
    product.publish = req.body.listed
    product.featured = req.body.featured

    if (product.hasVariants) {
      product.options = req.body.options
      product.variants = req.body.variants
    }

    // maybe I can save it after all just once
    await product.save()

    await Image.updateProductImages(product, req.body.images)

    const oldCategories = await product.categories()
    const oldCategoryIds = oldCategories.map(category => category.id)
    const newCategoryIds = req.body.categories || []

    const toAddCategoryIds = newCategoryIds.filter(x => oldCategoryIds.indexOf(x) < 0)
    const toRemoveCategoryIds = oldCategoryIds.filter(x => newCategoryIds.indexOf(x) < 0)

    await Category.updateMany(
      { _id: { $in: toAddCategoryIds } },
      { $push: { products: product._id } }
    )
    await Category.updateMany(
      { _id: { $in: toRemoveCategoryIds } },
      { $pull: { products: product._id } }
    )

    res.json({
      product: productTemplate(product)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.productId)
    res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postProductReview = async (req, res, next) => {
  const product = await Product.findById(req.params.productId)
  if (!product) return stdRes._400(res, 'Producto no encontrado')

  const user = req.user
  const value = req.body.value
  const comment = req.body.comment
  // TODO: check if the user has bought the product and add a mark
  // TODO: add an optional image to the reviews
  const review = await Review.set({
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
  res.json({ review: reviewTemplate(review, user._id) })
}
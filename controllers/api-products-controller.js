const Product = require('../models/Product')
const Category = require('../models/Category')
const Image = require('../models/Image')

const productTemplate = require('../models/templates/product')

const stdRes = require('../utils/standard-response')

exports.getProduct = async (req, res, next) => {
  try {
    console.log(req.params.productId)
    const product = await Product.findById(req.params.productId)

    // TODO: only admins can access not listed
    if (!product) return stdRes._400(res, 'Product not found')

    res.json({
      success: true,
      product: productTemplate(product)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getProducts = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const ITEMS_PER_PAGE = 6
    const itemsCount = await Product.find().countDocuments()

    const withPagination = req.query.all?.toLowerCase() !== 'true'
    // TODO: if not admin find({ publish: true })
    let products
    if (withPagination) {
      products = await Product.find()
        .sort({ updated: -1 })
        .limit(ITEMS_PER_PAGE)
        .skip((page - 1) * ITEMS_PER_PAGE)
    } else {
      products = await Product.find().sort({ updated: -1 })
    }

    res.json({
      success: true,
      products: products?.map(product => productTemplate(product)),
      // eslint-disable-next-line multiline-ternary
      pagination: withPagination ? {
        items: itemsCount,
        pages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
        current: page,
        from: ITEMS_PER_PAGE * (page - 1) + 1,
        to: Math.min(itemsCount, ITEMS_PER_PAGE * page),
        hasNext: ITEMS_PER_PAGE * page < itemsCount,
        hasPrev: page > 1
      } : undefined
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
      success: true,
      product: productTemplate(product)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId
    const product = await Product.findById(productId)

    console.log(typeof product.stock)
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
      success: true,
      product: productTemplate(product)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.productId)
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}
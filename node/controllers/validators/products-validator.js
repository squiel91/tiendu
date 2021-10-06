const Product = require('../../models/Product')
const stdRes = require('../../utils/errors')

exports.validateProduct = async (req, res, next) => {
  try {
    if (!req.body.title) return stdRes._400(res, 'title', 'Please enter a title')
    req.body.title = req.body.title.trim()

    if (!req.body.handle) return stdRes._400(res, 'handle', 'Please enter handle')
    req.body.handle = req.body.handle.trim().toLowerCase()

    if (!/^[a-z0-9-]+$/i.test(req.body.handle)) return stdRes._400(res, 'handle', 'Please enter valid handle')

    if (req.method === 'POST') {
      const possibleHandleDuplicate = await Product.findOne({ handle: req.body.handle })
      if (possibleHandleDuplicate) return stdRes._400(res, 'handle', 'There is a page with the same handle. Choose another one')
    }

    if (req.method === 'PATCH') {
      const patchedProd = await Product.findById(req.params.productId)
      if (patchedProd.handle !== req.body.handle) {
        const possibleHandleDuplicate = await Product.findOne({ handle: req.body.handle })
        if (possibleHandleDuplicate) return stdRes._400(res, 'handle', 'There is a page with the same handle. Choose another one')
      }
    }

    if (req.body.compareAt && req.body.compareAt < req.body.price) return stdRes._400(res, 'compareAt', 'It must be higher than the price')

    if (req.body.stock) {
      req.body.stock = parseInt(req.body.stock)
      if (req.body.stock < 0) return stdRes._400(res, 'stock', 'If not empty, the stock must be equal greater than than 0')
    }

    if (!req.body.description) req.body.description = req.body.description.trim().toLowerCase()

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postProductReview = async (req, res, next) => {
  if (!req.body.value || (typeof req.body.value) !== 'number' || req.body.value < 1 || req.body.value > 5) {
    return res.status(400).json({ error: 'El valor de la reseña debe ser un numero entre 1 y 5' })
  }
  next()
}
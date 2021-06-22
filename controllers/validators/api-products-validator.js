const stdRes = require('../../utils/standard-response')

exports.postProduct = async (req, res, next) => {
  try {
    if (!req.body.title) return stdRes._400(res, 'title', 'Please enter a title')
    req.body.title = req.body.title.trim()

    if (!req.body.handle) return stdRes._400(res, 'handle', 'Please enter handle')
    req.body.handle = req.body.handle.trim().toLowerCase()

    if (!/^[a-z0-9-]+$/i.test(req.body.handle)) return stdRes._400(res, 'handle', 'Please enter valid handle')

    const possibleHandleDuplicate = await Page.findOne({ handle: req.body.handle })
    if (possibleHandleDuplicate) return stdRes._400(res, 'handle', 'There is a page with the same handle. Choose another one')

    if (!req.body.price) return stdRes._400(res, 'price', 'Please enter a price')

    if (req.body.compareAt && req.body.compareAt < req.body.price) return stdRes._400(res, 'compareAt', 'It must be higher than the price')

    if (req.body.stock) {
      req.body.stock = parseInt(req.body.stock)
      if (req.body.stock < 0) return stdRes._400(res, 'stock', 'If not empty, the stock must be equal greater than than 0')
    }

    if (!req.body.description) req.body.description = req.body.description.trim().toLowerCase()

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

// TODO
exports.postProduct = async (req, res, next) => {
  next()
}

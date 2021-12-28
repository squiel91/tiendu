const Category = require('../../models/Category')

const stdRes = require('../../utils/errors')

exports.postCategory = async (req, res, next) => {
  try {
    if (!req.body.title) return stdRes._400(res, 'title', 'Please enter title')
    req.body.title = req.body.title.trim()

    if (!req.body.handle) return stdRes._400(res, 'handle', 'Please enter handle')
    req.body.handle = req.body.handle.trim().toLowerCase()

    if (!/^[a-z0-9-]+$/i.test(req.body.handle)) return stdRes._400(res, 'handle', 'Please enter valid handle')

    const possibleHandleDuplicate = await Category.findOne({ handle: req.body.handle })
    if (possibleHandleDuplicate) return stdRes._400(res, 'handle', 'It is duplicated. Choose another one')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

// TODO
exports.patchCategory = async (req, res, next) => {
  next()
}

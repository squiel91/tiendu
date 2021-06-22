const Page = require('../../models/Page')

const stdRes = require('../../utils/standard-response')

exports.postPage = async (req, res, next) => {
  try {
    if (!req.body.title) return stdRes._400(res, 'title', 'Ingresa un título')
    req.body.title = req.body.title.trim()

    if (!req.body.handle) return stdRes._400(res, 'handle', 'Ingresa un handle válido')
    req.body.handle = req.body.handle.trim().toLowerCase()
    if (!/^[a-z0-9]+[a-z0-9-]+[a-z0-9]+$/i.test(req.body.handle)) return stdRes._400(res, 'handle', 'Please enter valid handle')

    const possibleHandleDuplicate = await Page.findOne({ handle: req.body.handle })
    if (possibleHandleDuplicate) return stdRes._400(res, 'handle', 'Ya hay un handle igual para otra página. Elegí otro')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchPage = async (req, res, next) => {
  try {
    if (!req.body.title) return stdRes._400(res, 'title', 'Ingresa un título')
    req.body.title = req.body.title.trim()

    if (!req.body.handle) return stdRes._400(res, 'handle', 'Ingresa un handle válido')
    req.body.handle = req.body.handle.trim().toLowerCase()
    if (!/^[a-z0-9]+[a-z0-9-]+[a-z0-9]+$/i.test(req.body.handle)) return stdRes._400(res, 'handle', 'Please enter valid handle')

    const possibleHandleDuplicate = await Page.findOne({ _id: { $ne: req.params.pageId }, handle: req.body.handle })
    if (possibleHandleDuplicate) return stdRes._400(res, 'handle', 'Ya hay un handle igual para otra página. Elegí otro')

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

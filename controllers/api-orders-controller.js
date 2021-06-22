
const Order = require('../models/Order')
const orderTemplate = require('../models/templates/order')

const orderUpdatedEmail = require('../email-templates/order-updated-email')
const mailer = require('../utils/mailer')
const stdRes = require('../utils/standard-response')

const ITEMS_PER_PAGE = 6

exports.getOrders = async (req, res, next) => {
  try {
    const page = req.query.page || 1

    const itemsCount = await Order.find(req.query.status ? { status: { $in: req.query.status } } : {}).countDocuments()

    const orders = await Order.find(req.query.status ? { status: { $in: req.query.status } } : {}).sort({ updated: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    res.json({
      success: true,
      orders: orders.map(order => orderTemplate(order)),
      pagination: {
        items: itemsCount,
        pages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
        current: page,
        from: ITEMS_PER_PAGE * (page - 1) + 1,
        to: Math.min(itemsCount, ITEMS_PER_PAGE * page),
        hasNext: ITEMS_PER_PAGE * page < itemsCount,
        hasPrev: page > 1
      }
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
    res.json({ success: true, order: orderTemplate(order) })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postOrder = async (req, res, next) => {
  next()
}

exports.patchOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
    const prevStatus = order.status
    order.traking = req.body.traking
    order.status = req.body.status
    await order.save()

    if (prevStatus !== order.status) {
      mailer(order.personal.email, orderUpdatedEmail.subject(order), orderUpdatedEmail.body(order, prevStatus))
    }

    res.json({ success: true, order: orderTemplate(order) })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId)
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}
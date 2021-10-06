const Subscription = require('../models/Subscription')
const stdRes = require('../utils/errors')
const subscriptionTemplate = require('../models/templates/subscription')

exports.getSubscriptions = async (req, res, next) => {
  try {
    const page = req.query.page || 1

    const ITEMS_PER_PAGE = 6
    const itemsCount = await Subscription.find().countDocuments()

    const subscriptions = await Subscription.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    res.json({
      subscriptions: subscriptions.map(subscription => subscriptionTemplate(subscription)),
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

exports.postSubscriptions = async (req, res, next) => {
  try {
    const email = req.body.email
    const duplicateEmail = await Subscription.findOne({ email })
    if (duplicateEmail) return res.json({
      message: '¡Ya estas suscripto!'
    })
    const subscriptor = new Subscription({ email })
    await subscriptor.save()
    res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

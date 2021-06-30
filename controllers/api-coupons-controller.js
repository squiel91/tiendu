const Coupon = require('../models/Coupon')

const couponTemplate = require('../models/templates/coupon')

const stdRes = require('../utils/standard-response')

// populated with it's products
exports.getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId)

    if (!coupon) return stdRes._400(res, 'Coupon not found')

    res.json({
      success: true,
      coupon: couponTemplate(coupon)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// NOT populated with it's products
exports.getCoupons = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6
    const itemsCount = await Coupon.find().countDocuments()

    const withPagination = req.query.all?.toLowerCase() !== 'true'
    // TODO: if not admin find({ listed: true })
    let coupons;
    if (withPagination) {
      coupons = await Coupon
        .find()
        .sort({ updated: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    } else {
      coupons = await Coupon
        .find()
        .sort({ updated: -1 })
    }

    res.json({
      success: true,
      coupons: coupons?.map(coupon => couponTemplate(coupon)),
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

exports.postCoupon = async (req, res, next) => {
  try {
    let coupon = new Coupon({
      description: req.body.description,
      code: req.body.code,
      active: req.body.active,
      percentage: req.body.percentage,
      amount: req.body.amount,
      minSpend: req.body.minSpend,
      maxUses: req.body.maxUses
    })
    coupon = await coupon.save()
    res.json({
      success: true,
      coupon: couponTemplate(coupon)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId
    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      req.body,
      { new: true }
    )
    res.json({
      success: true,
      coupon: couponTemplate(coupon)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.couponId)
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}

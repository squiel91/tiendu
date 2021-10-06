const Coupon = require('../models/Coupon')
const couponTemplate = require('../models/templates/coupon')

const stdRes = require('../utils/errors')

// populated with it's products
exports.getCoupon = async (req, res, next) => {  
  try {
    let coupon
    if (req.query.by === 'code') {
      coupon = await Coupon.findOne({ code: req.params.couponId?.toUpperCase(), active: true })
    } else {
      coupon = await Coupon.findById(req.params.couponId)
    }

    if (!coupon) return stdRes._400(res, 'El cupón ingresado no es válido.')

    res.json({
      coupon: couponTemplate(coupon)
    })
  } catch (error) { 
    console.error(error)
    stdRes._500(res, error.message)
  }
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
      coupon: couponTemplate(coupon)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId
    const coupon = await Coupon.findById(couponId)

    coupon.description = req.body.description
    coupon.code = req.body.code
    coupon.active = req.body.active
    if (req.body.percentage) {
      coupon.percentage = req.body.percentage
      coupon.amount = undefined
    }
    if (req.body.amount) {
      coupon.percentage = undefined
      coupon.amount = req.body.amount
    }
    coupon.minSpend = req.body.minSpend
    coupon.maxUses = req.body.maxUses

    await coupon.save()

    res.json({
      coupon: couponTemplate(coupon)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.couponId)
    res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

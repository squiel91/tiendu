const Coupon = require('../../models/Coupon')

const stdRes = require('../../utils/standard-response')

exports.validateParamsCoupon = async (req, res, next) => {
  console.log(req.method)

  try {
    if (req.body.code) {
      req.body.code = req.body.code.trim()
      if (!req.body.code.match(/^[A-Z0-9-]+$/)) return stdRes._400(res, 'code', 'El código del cupón solo puede tener letras mayúsculas, números y guiones')
    }
    if (req.method === 'POST' && !req.body.code) return stdRes._400(res, 'code', 'Ingresa un código para el cupón')

    if (req.body.code) {
      const existingCoupon = await Coupon.findOne({ code: req.body.code, _id: req.params.couponId ? { $ne: req.params.couponId } : undefined })
      if (existingCoupon) return stdRes._400(res, 'code', 'Ya existe un cupón con este código')
    }

    if (typeof req.body.active !== 'boolean' && req.body.active) return stdRes._400(res, 'active', 'El valor de activo debe ser verdadero o falso (true o false)')

    req.body.since = req.body.since && new Date(req.body.since)
    req.body.until = req.body.until && new Date(req.body.until)

    const percentage = req.body.percentage
    if (percentage === 0 || percentage) {
      if (typeof percentage !== 'number' || percentage <= 0 || percentage > 100) return stdRes._400(res, 'discount', 'El porcentaje de descuento debe ser un número mayor a 0 y menor o igual a 100')
    }

    const amount = req.body.amount
    if (req.method === 'POST' && (amount === 0 || amount)) {
      if (typeof amount !== 'number' || amount <= 0) return stdRes._400(res, 'discount', 'El monto de descuento debe ser un número mayor que 0')
    }

    if (!amount && !percentage) return stdRes._400(res, 'Se debe especificar un tipo de descuento (porcentaje o monto fijo)')

    if (req.body.minSpend === 0 || req.body.minSpend) {
      const minSpend = req.body.minSpend
      if (typeof minSpend !== 'number' || minSpend < 0) return stdRes._400(res, 'minSpend', 'El monto de de la orden debe ser un número mayor o igual que 0 (en caso de ser 0 es preferible dejar el campo vacío)')
    }

    if (req.body.maxUses === 0 || req.body.maxUses) {
      const maxUses = req.body.maxUses
      if (typeof maxUses !== 'number' || maxUses % 1 !== 0 || maxUses <= 0) return stdRes._400(res, 'maxUses', 'El monto de descuento debe ser un número natural (entero mayor a 0)')
    }

    next()
  } catch (error) { stdRes._500(res, error.message) }
}

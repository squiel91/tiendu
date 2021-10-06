module.exports = cupon => {
  if (!cupon) return undefined
  return {
    id: cupon.id,
    code: cupon.code,
    description: cupon.description,
    active: cupon.active === true,
    percentage: cupon.percentage,
    amount: cupon.amount,
    timesUsed: cupon.timesUsed || 0,
    created: cupon.created,
    updated: cupon.updated,

    // conditions
    minSpend: cupon.minSpend,
    maxUses: cupon.maxUses
  }
}

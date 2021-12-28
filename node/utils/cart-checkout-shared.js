const mongoose = require('mongoose')

const Product = require('../models/Product')
const Coupon = require('../models/Coupon')

exports.getItems = (req) => {
  let items
  if (req.user) {
    items = req.user.cart.map(item => {
      return {
        productId: item.product.toString(),
        variantId: item.variantId,
        title: item.title,
        quantity: item.quantity
      }
    })
  } else {
    // in the user is not authenticated, then the cart is retrived from the request
    items = req.body.items
  }

  return items || []
}

exports.expandedItems = async (itemsSlim, expandItemFunction) => {
  const productIds = itemsSlim.map(item => mongoose.Types.ObjectId(item.productId))
  const products = await Product.find({_id: { $in: productIds }, publish: true  })
  const productIndex = Object.fromEntries(products.map(product => [product.id, product]))   

  const itemsExpanded = []
  const missingProducts = []
  const missingVariants = []
  const outOfStockItems = []
  let totalPrice = 0

  itemsSlim.forEach(item => {
    const product = productIndex[item.productId]
    const variantId = item.variantId
    if (!product) {
      missingProducts.push(item)
      return
    }
    if ((variantId && (!product.hasVariants || variantId > product.variants.length)) ||
      (!variantId && product.hasVariants)
    ) {
      missingVariants.push({...item, handle: product.handle })
      return
    }  
    
    let variant
    if (variantId) {
      variant = product.variants[variantId - 1]
    }
    const stock = (variant || product).stock
    if (stock !== null && stock < item.quantity) { 
      // only true when stock is a number and less than ordered quantity 
      outOfStockItems.push({...item, handle: product.handle })
    }
    
    totalPrice += (variant || product).price * item.quantity 
    itemsExpanded.push(expandItemFunction(product, variant, item.quantity, variantId))
  })

  return {
    totalPrice,
    productIndex,
    itemsExpanded,
    missingProducts,
    missingVariants,
    outOfStockItems
  }
}

exports.applyCoupon = async (couponCode, itemsExpanded, totalPrice, markItemsDiscountOnPercentage = true) => {
  let discountedPrice
  let coupon
  let couponError
  
  coupon = await Coupon.findOne({ code: couponCode })
  if (!coupon) { 
    couponError = 'Cupón no encontrado.'
  } else {
    // check contrains
    if (!coupon.active || coupon.timesUsed > coupon.maxUses) {
      couponError = 'El cupón ya no es válido. Remuevelo antes de continuar con la compra.'
    } else {
      // proceed to apply the discount
      if (totalPrice < coupon.minSpend) {
        couponError = `El monto mínimo de la orden para utilizar este cupón es $${coupon.minSpend}. Remuevelo o agrega otros productos antes de continuar la compra.`
      } else {
        discountedFrom = totalPrice
        if (coupon.amount) {
          discountedPrice = Math.max(0, totalPrice - coupon.amount)
        }
        if (coupon.percentage) {
          discountedPrice *= 1 - (coupon.percentage / 100)

          if (markItemsDiscountOnPercentage) {
            itemsExpanded.forEach(item => {
              item.discountedFrom = item.price
              item.price *= 1 - coupon.percentage / 100
            })
          }
        }
      }
    }
  }

  return {
    coupon,
    discountedPrice,
    couponError
  }
}

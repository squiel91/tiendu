const Product = require('../models/Product')

const imageTemplate = require('../models/templates/image')

const shared = require('../utils/cart-checkout-shared')
const stdRes = require('../utils/errors')

exports.addItemToCart = async (req, res, next) => {
  try {
    const productId = req.body.productId
    if (req.user && productId) {
      const variantId = req.body.variantId
      const product = await Product.findOne({ _id: productId, publish: true })
      if (!product) {
        return res.status(400).json({
          error: 'El producto no existe o temporalmente no está publicado'
        })
      }
  
      if (variantId && (!product.hasVariants || variantId > product.variants.length)) {
        return res.status(400).json({
          error: 'La variante no es válida'
        })
      }
      req.user.addToCart(product, req.body.quantity, variantId, req.body.absolute)
      await req.user.save()
    }
    next()
  } catch (error) { 
    console.error(error)
    return res.status(500).json( {
      message: error.message
    })
  }

}

exports.retriveCart = async (req, res, next) => {
  try {
    
    let items = shared.getItems(req)
    
    if (req.body.fastReturn) {
      return res.json({
        cartQty: items.reduce((accum, item) => accum + item.quantity, 0)
      })
    }

    const { 
      totalPrice,
      itemsExpanded,
      missingProducts,
      missingVariants,
      outOfStockItems
    } = await shared.expandedItems(items, (product, variant, quantity, variantId) => {
      const item = variant || product
      return {
        productId: product.id,
        variantId,
        variantName: variant?.values.join(', '),
        handle: product.handle,
        title: product.title,
        image: imageTemplate(((variant?.images?.length > 0 ? variant.images : product.images) || [])[0]),
        price: item.price,
        quantity,
        stock: item.stock,
      }
    })
  
    let discountedPrice, coupon, couponError
  
    const couponCode = req.body.coupon
    if (couponCode) {
      // it modifies the itemsExpanded items price and adds discountedFrom property
      ({ discountedPrice, coupon, couponError } = await shared.applyCoupon(couponCode, itemsExpanded, totalPrice)) 
    }
  

    if (req.user) {
      // if the user is authenticated, we should remove the items with errors
      req.user.removeFromCart(missingProducts.concat(missingVariants))
      await req.user.save()
    }
  
    res.json({
      items: itemsExpanded,
      cartQty: itemsExpanded?.reduce((accum, item) => accum + item.quantity, 0) || 0,
      missingProducts,
      missingVariants,
      outOfStockItems,
      totalPrice: discountedPrice || discountedPrice === 0 ? discountedPrice : totalPrice,
      discountedFrom: discountedPrice || discountedPrice === 0? totalPrice : undefined,
      coupon: coupon && {
        code: coupon.code,
        description: coupon.description
      },
      couponError
    })
  } catch (error) { 
    console.error(error)
    return res.status(500).json( {
      message: error.message
    })
  }
}

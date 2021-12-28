const imageTemplate = require('./image')
const reviewTemplate = require('./review')

// user is sent (optionally) so to identify their own reviews
module.exports = (product, user) => {

  let price, compareAt, stock 

  if (!product.hasVariants) {
    price = product.price
    compareAt = product.compareAt
    stock = product.stock
  } else {
    let minPrice = product.variants[0].price
    let maxPrice = product.variants[0].price
    let compareAtAggregated = product.variants[0].compareAt
    let stockAggregated = product.variants[0].stock
    for (let i = 0; i < product.variants.length; i++) {
      const productVariant = product.variants[i]
      minPrice = Math.min(minPrice, productVariant.price)
      maxPrice = Math.max(maxPrice, productVariant.price)
      if (compareAtAggregated !== productVariant.compareAt) compareAtAggregated = undefined
      if (stockAggregated !== productVariant.stock) stockAggregated = undefined
    }
    price = minPrice === maxPrice? minPrice : { 
      min: minPrice,
      max: maxPrice,
      default: product.price
    }
    compareAt = {
      aggregated: compareAtAggregated,
      default: product.compareAt
    }
    stock = {
      aggregated: stockAggregated,
      default: product.stock
    }
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    price,
    compareAt,
    stock,
    inStock: product.inStock(),
    sold: product.sold,
    hasVariants: product.hasVariants,
    options: product.options,
    variants: product.hasVariants ? product.variants.map((variant, variantIndex) => {
      return {
        id: variantIndex + 1,
        values: variant.values,
        price: variant.price,
        compareAt: variant.compareAt,
        stock: variant.stock,
        inStock: variant.stock === null || variant.stock > 0,
        images: variant.images.map(image => imageTemplate(image))
      }
    }) : undefined,
    description: product.description,
    listed: product.publish,
    featured: product.featured,
    images: product.allImages()?.map(img => imageTemplate(img)),
    reviews: (product.reviews || []).map(review => reviewTemplate(review, user)),
    averageReview: (product.reviews || []).reduce((acumm, review) => review.value + acumm, 0) / product.reviews.length,
 
    // deprecated
    published: product.publish
  }
}

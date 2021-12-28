const Product = require('../models/Product')
const productTemplate = require('../models/templates/product')

// Recommend products related to the requested products id. The first products belongs to the same categories , picked randomly.
// If those arent enough, it randomly picks other products to fill up to RECOMMENDED_QTY.
const RECOMMENDED_QTY = 6

// TODO: change to a more efficient (Fisher-Yates Shuffle)
function shuffled(toShuffle) {
  return toShuffle
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function includeProduct (productId, productArray) {
  for (let i = 0; i < productArray.length; i++) {
    if (productId.equals(productArray[i].id)) return true
  }
  return false
}

// TODO: make it reusable so it accepts a list of products instead of just one. If empty list then it all filled with random products
exports.getProductRecommendations = async (req, res) => {
  const productId = req.params.productId || (req.query.products || [])[0]

  let recommendedProducts = [] // list to be returned. Built up incrementally
  let product

  if (productId) {
    product = await Product.findById(productId)
  
    if (!product) return res.status(404).json({
      message: 'Product not found'
    })
  
    if (!product.publish && !req.user?.admin) {
      return res.status(401).json({
        message: 'Unauthorized access (only admin can access unpublished products recommendations)'
      })
    }
  
    const belongingCategories = shuffled(await product.categories()) // list of categories that includes the product randomly, shuffled
      
    /*
      for each category, until we fill the recommendations,
      we retrive the published products, making sure are
      not already to recommend nor is the original product.
    */
    for (let i = 0; i < belongingCategories.length; i++) {
      const elegibleCategoryProducts = await Product.find({
        _id: { $in: belongingCategories[i].products.filter(categortyProductId => !includeProduct(categortyProductId, [product].concat(recommendedProducts))) }, 
        publish: true
      })
      recommendedProducts = recommendedProducts.concat(shuffled(elegibleCategoryProducts).slice(0, RECOMMENDED_QTY - recommendedProducts.length))
      if (recommendedProducts.length >= RECOMMENDED_QTY) break
    }
  }

  /*
    the rest is filled up with random products, making sure are
    not already to recommend nor is the original product.
  */
  const remaining = RECOMMENDED_QTY - recommendedProducts.length
  if (remaining > 0) {
    const randomProducts = (await Product.aggregate([
      { $match : { _id: { $nin: recommendedProducts.concat(product ? [product] : []).map(p => p._id) }, publish: true } },
      { $sample: { size: remaining } }
    ])).map(productDocument => new Product(productDocument))
    recommendedProducts = shuffled(recommendedProducts).concat(randomProducts)
  }

  res.json({
    recommendedProducts: recommendedProducts.map(product => productTemplate(product))
  })
}
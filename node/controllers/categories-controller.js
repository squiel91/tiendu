const Category = require('../models/Category')

const categoryTemplate = require('../models/templates/category')

const stdRes = require('../utils/errors')

// by id or handle
const findBy = (handle, categoryId) => {
  if (handle) {
    return Category.findOne({ handle: categoryId })
  } else {
    return Category.findById(categoryId)
  }
} 

// populated with it's products
exports.getCategory = async (req, res, next) => {
  try {
    const category = await findBy(req.query.handle, req.params.categoryId).populate('image').populate('products')
    
    if (!category) return res.status(404).json({
      message: 'category not found'
    })

    if (!category.listed && !req.user?.admin) {
      return res.status(401).json({
        message: 'Unauthorized access (only admin can access unlisted categories)'
      })
    }

    res.json({
      category: categoryTemplate(category)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// NOT populated with it's products
exports.getCategories = async (req, res, next) => {

  try {
    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6

    const listedFilter = req.query.listedOnly || !req.user?.admin ? { listed: true } : {}

    const itemsCount = await Category.find(listedFilter).countDocuments()

    const withPagination = req.query.all?.toLowerCase() !== 'true'
    let categories
    if (withPagination) {
      categories = await Category.find(listedFilter)
        .sort({ updated: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    } else {
      categories = await Category.find(listedFilter).sort({ updated: -1 })
    }

    res.json({
      categories: categories?.map(category => categoryTemplate(category)),
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

exports.postCategory = async (req, res, next) => {
  try {
    let category = new Category({
      title: req.body.title,
      handle: req.body.handle,
      description: req.body.description,
      products: req.body.products,
      image: req.body.image,
      listed: req.body.listed,
      featured: req.body.featured
    })
    category = await category.save()
    res.json({
      category: categoryTemplate(category)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId
    const category = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    )
    res.json({
      category: categoryTemplate(category)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    await Category.findByIdAndDelete(categoryId)
    res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

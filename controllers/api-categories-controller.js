const Category = require('../models/Category')

const categoryTemplate = require('../models/templates/category')

const stdRes = require('../utils/standard-response')

// populated with it's products
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId).populate('image').populate('products')

    // TODO: only admins can access not listed
    if (!category) return stdRes._400(res, 'Category not found')

    res.json({
      success: true,
      category: categoryTemplate(category)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// NOT populated with it's products
exports.getCategories = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6
    const itemsCount = await Category.find().countDocuments()

    const withPagination = req.query.all?.toLowerCase() !== 'true'
    // TODO: if not admin find({ listed: true })
    let categories;
    if (withPagination) {
      categories = await Category.find()
        .sort({ updated: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    } else {
      categories = await Category.find().sort({ updated: -1 })
    }

    res.json({
      success: true,
      categories: categories?.map(category => categoryTemplate(category)),
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
      success: true,
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
      success: true,
      category: categoryTemplate(category)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    await Category.findByIdAndDelete(categoryId)
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}

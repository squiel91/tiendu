const mongoose = require('mongoose')
const Customization = require('../models/Customization')
const Category = require('../models/Category')

const customizationTemplate = require('../models/templates/customization')
const categoryTemplate = require('../models/templates/category')

const { catchServerError } = require('../utils/errors')

const ITEMS_TO_SHOW = 6

module.exports.getCustomization = async function(req, res) {
  catchServerError(async () => {
    res.json({
      customization: customizationTemplate(await Customization.findOne())
    })
  })
}

// TODO: change the name of this function because it is multypurpused now
module.exports.getHomeCategories = async (req, res) => {
  catchServerError(async () => {

    // Homepage categories
    const customization = await Customization.findOne()
    const homeCategoriesRaw = customization.homeCategories || []
  
    const homeCategoryIds = homeCategoriesRaw.map(
      homeCategory => mongoose.Types.ObjectId(homeCategory.category)
    )
  
    const categories = await Category
      .find(
        { _id: { $in: homeCategoryIds } }
      )
      .populate({
        path: 'products',
        match: { publish: true },
        options: { perDocumentLimit: ITEMS_TO_SHOW }
      })
      .populate('image')
  
    
    const homeCategories = []
    
    homeCategoriesRaw.forEach(homeCategoryRaw => {
      
      const homeCategory = categories.find(category => 
        homeCategoryRaw.category.equals(category._id))
      if (homeCategory) {
        homeCategories.push({
          category: categoryTemplate(homeCategory),
          alternativeTitle: homeCategoryRaw.alternativeTitle
        })
      }
    })

    // Featured categories
    const featuredCategories = (await Category.find({ listed: true, featured: true }).populate('image')).map(category => categoryTemplate(category))

    res.json({
      homeCategories,
      featuredCategories 
    })
  })
}

// This removes the items with undefined category
const removeInvalidCategories = (homeCategoriesSlim) => {
  return homeCategoriesSlim?.filter(homeCategory => homeCategory.category) || []
}

module.exports.postCustomization = async (req, res) => {
  catchServerError(async () => {
    let customization =  await Customization.findOne()

    if (!customization) {
      customization = new Customization({
        globalTopMessage: req.body.globalTopMessage,
        menu: req.body.menu,
        homeCategories: removeInvalidCategories(req.body.homeCategories)
      })
    } else {
      customization.globalTopMessage = req.body.globalTopMessage
      customization.menu = req.body.menu
      customization.homeCategories = removeInvalidCategories(req.body.homeCategories)
    }
    await customization.save()
    
    res.json({
      customization: customizationTemplate(customization)
    })
  })
}
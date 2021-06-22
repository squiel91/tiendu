const Page = require('../models/Page')

const pageTemplate = require('../models/templates/page')
const stdRes = require('../utils/standard-response')

exports.getPage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.pageId)
    res.json({ success: true, page: pageTemplate(page) })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getPages = async (req, res, next) => {
  try {
    const page = req.query.page || 1

    const ITEMS_PER_PAGE = 6
    const itemsCount = await Page.find().countDocuments()

    const pages = await Page.find()
      .sort({ updated: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    res.json({
      success: true,
      pages: pages.map(page => pageTemplate(page)),
      pagination: {
        items: itemsCount,
        pages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
        current: page,
        from: ITEMS_PER_PAGE * (page - 1) + 1,
        to: Math.min(itemsCount, ITEMS_PER_PAGE * page),
        hasNext: ITEMS_PER_PAGE * page < itemsCount,
        hasPrev: page > 1
      }
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postPage = async (req, res, next) => {
  try {
    let page = new Page({
      title: req.body.title,
      handle: req.body.handle,
      content: req.body.content || undefined,
      published: req.body.published
    })
    page = await page.save()
    res.json({
      success: true,
      page: pageTemplate(page)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchPage = async (req, res, next) => {
  try {
    const pageId = req.params.pageId

    const updatedData = req.body
    const page = await Page.findByIdAndUpdate(pageId, updatedData, { new: true })
    res.json({
      success: true,
      page: pageTemplate(page)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deletePage = async (req, res, next) => {
  try {
    await Page.findByIdAndDelete(req.params.pageId)
    res.json({ success: true })
  } catch (error) { stdRes._500(res, error.message) }
}
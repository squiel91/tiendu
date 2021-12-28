const multer = require('multer')
const fs = require('fs')

const rootPath = require('../utils/root-path')
const stdRes = require('../utils/errors')
const { catchServerError } = require('../utils/errors')
const path = require('path')
const sharp = require('sharp');

const Image = require('../models/Image')

const imageTemplate = require('../models/templates/image')

// Store image with Multer
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img')
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, callback) => {
  callback(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype))
}

exports.saveToFS = multer({ storage: fileStorage, fileFilter }).single('image')

exports.resizeImage = async (req, res, next) => {
  catchServerError(async () => {
    await sharp(req.file.path) // CAREFULL
    .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .rotate()
    .resize(1200, 1200)
    .jpeg({ quality: 90 })
    .toFile(path.resolve(req.file.destination, 'cover', req.file.filename))
    
    await sharp(req.file.path)
      .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .rotate()
      .resize(600, 600)
      .jpeg({ quality: 90 })
      .toFile(path.resolve(req.file.destination, 'thumb', req.file.filename))
  
    // TIP: in case there is no need to keep the original image
    // fs.unlinkSync(req.file.path)
    next()
  })
}

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ created: -1 })
    return res.json({
      images: images?.map(image => imageTemplate(image))
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postImages = async (req, res) => {
  try {
    if (!req.file) {
      return stdRes._400(res, 'Unsuported image type')
    }

    let filePath = req.file.path.replace('public', '')
    filePath = filePath.replace(/\\/g, '/')

    path.resolve(req.file.destination, 'cover', req.file.filename)

    let image = new Image({
      name: req.file.originalname,
      src: filePath,
      coverSrc: path.join(req.file.destination, 'cover', req.file.filename).replace('public', '').replace(/\\/g, '/'),
      thumbSrc: path.join(req.file.destination, 'thumb', req.file.filename).replace('public', '').replace(/\\/g, '/')
    })

    image = await image.save()
    res.json({
      image: imageTemplate(image)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchImages = async (req, res) => {
  try {
    const populatedImage = await Image.findById(req.params.imageId).populate('products')
    populatedImage.alt = req.body.alt
    populatedImage.name = req.body.name

    for (const product of populatedImage.products) {
      const toUpdateProdImage = product.images.find(
        productImage => productImage.id === populatedImage.id
      )
      toUpdateProdImage.alt = populatedImage.alt
      toUpdateProdImage.name = populatedImage.name
      await product.save()
    }
    await populatedImage.save()

    res.json({ image: imageTemplate(populatedImage) })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteImages = async (req, res) => {
  try {
    const populatedImage = await Image.findById(req.params.imageId).populate('products')
    for (const product of populatedImage.products) {
      product.images = product.images.filter(productImage => productImage.id !== populatedImage.id)
      await product.save()
    }
    await Image.findByIdAndDelete(req.params.imageId)
    fs.unlink(
      rootPath('public', populatedImage.src),
      error => { if (error) console.error(error) }
    )

    res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

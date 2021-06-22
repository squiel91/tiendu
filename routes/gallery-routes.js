const express = require('express')

const galleryController = require('../controllers/gallery-controller')

const router = express.Router()

router.get('/images', galleryController.getGallery)
router.post('/images', galleryController.saveToFS, galleryController.resizeImage, galleryController.postGallery)
router.patch('/images/:imageId', galleryController.patchGallery)
router.delete('/images/:imageId', galleryController.deleteGallery)

module.exports = router

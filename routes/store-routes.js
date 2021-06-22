const express = require('express')

const router = express.Router()

const storeController = require('../controllers/store-controller')

router.get('/', storeController.getHomepage)
router.get('/productos/:productHandle', storeController.getProduct)
router.get('/carrito', storeController.getCart)
router.get('/carrito/checkout', storeController.getCheckout)

router.get('/ordenes/:orderId', storeController.getOrder)
router.get('/paginas/:pageHandle', storeController.getPage)
router.get('/categorias', storeController.getCategories)
router.get('/categorias/:categoryHandle', storeController.getCategory)

// Search
router.get('/busqueda', storeController.getSearch)

module.exports = router

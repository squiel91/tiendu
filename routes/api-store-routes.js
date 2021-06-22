
const express = require('express')
const router = express.Router()

const apiStoreValidator = require('../controllers/validators/api-store-validator')
const apiStoreController = require('../controllers/api-store-controller')

// Products
router.get('/products', apiStoreController.getProducts)
router.get('/products/:productId', apiStoreController.getProduct)
router.post('/products/:productHandle/review',
  apiStoreController.customerSetup,
  apiStoreValidator.postProductReview,
  apiStoreController.postProductReview
)

// Categories
router.get('/categories', apiStoreController.getCategories)
router.get('/categories/:categoryHandle', apiStoreController.getCategory) // need to discuss

// Pages
router.get('/pages', apiStoreController.getPages)
router.get('/pages/:pageId', apiStoreController.getPage)

// cart & checkout
router.get('/customers/exist', apiStoreController.getCustomersExist)

router.post('/cart',
  apiStoreValidator.postCart,
  apiStoreController.customerSetup,
  apiStoreController.postCart
)

router.post('/cart/checkout-mercadopago',
  apiStoreValidator.postCheckout,
  apiStoreController.customerSetup,
  apiStoreController.postCheckout
)

router.post('/subscribe', apiStoreValidator.postSubscribe, apiStoreController.postSubscribe)

module.exports = router

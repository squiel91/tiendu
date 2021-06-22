const express = require('express')
const router = express.Router()

// Controllers
const apiProductsController = require('../controllers/api-products-controller')
const apiCategoriesController = require('../controllers/api-categories-controller')
const apiOrdersController = require('../controllers/api-orders-controller')
const apiPagesController = require('../controllers/api-pages-controller')
const apiUsersController = require('../controllers/api-users-controller')
const apiSubscriptionsController = require('../controllers/api-subscriptions-controller')
const apiCouponsController = require('../controllers/api-coupons-controller')
const apiAdminController = require('../controllers/api-admin-controller')

// Validators
const apiAdminValidator = require('../controllers/validators/api-admin-validator')
const apiProductsValidator = require('../controllers/validators/api-products-validator')
const apiCategoriesValidator = require('../controllers/validators/api-categories-validator')
const apiPagesValidator = require('../controllers/validators/api-pages-validator')
const apiCouponsValidator = require('../controllers/validators/api-coupons-validator')

const authenticate = apiAdminController.adminAuth

// Categories
router.get('/categories', authenticate, apiCategoriesController.getCategories)
router.get('/categories/:categoryId', authenticate, apiCategoriesController.getCategory)
router.post('/categories', authenticate, apiCategoriesValidator.postCategory, apiCategoriesController.postCategory)
router.patch('/categories/:categoryId', authenticate, apiCategoriesValidator.patchCategory, apiCategoriesController.patchCategory)
router.delete('/categories/:categoryId', authenticate, apiCategoriesController.deleteCategory)

// Product
router.get('/products', authenticate, apiProductsController.getProducts)
router.get('/products/:productId', authenticate, apiProductsController.getProduct)
router.post('/products', authenticate, apiProductsValidator.postProduct, apiProductsController.postProduct)
router.patch('/products/:productId', authenticate, apiProductsValidator.postProduct, apiProductsController.patchProduct)
router.delete('/products/:productId', authenticate, apiProductsController.deleteProduct)

// Subscribe
router.get('/subscriptions', authenticate, apiSubscriptionsController.getSubscriptions)

// User
router.get('/users', authenticate, apiUsersController.getUsers)
router.get('/users/:userId', authenticate, apiUsersController.getUser)
router.post('/users', authenticate, apiAdminValidator.postUser, apiUsersController.postUser)
router.patch('/users/:userId', authenticate, apiUsersController.patchUser)
router.delete('/users/:userId', authenticate, apiUsersController.deleteUser)

// Pages
router.get('/pages', authenticate, apiPagesController.getPages)
router.get('/pages/:pageId', authenticate, apiPagesController.getPage)
router.post('/pages', authenticate, apiPagesValidator.postPage, apiPagesController.postPage)
router.patch('/pages/:pageId', authenticate, apiPagesValidator.patchPage, apiPagesController.patchPage)
router.delete('/pages/:pageId', authenticate, apiPagesController.deletePage)

// Orders
router.get('/orders', authenticate, apiOrdersController.getOrders)
router.get('/orders/:orderId', authenticate, apiOrdersController.getOrder)
router.post('/orders/:orderId', authenticate, apiOrdersController.postOrder)
router.patch('/orders/:orderId', authenticate, apiOrdersController.patchOrder)
router.delete('/orders/:orderId', authenticate, apiOrdersController.deleteOrder)

// Coupons
router.get('/coupons', apiCouponsController.getCoupons)
router.get('/coupons/:couponId', apiCouponsController.getCoupon)
router.post('/coupons', authenticate, apiCouponsValidator.validateParamsCoupon, apiCouponsController.postCoupon)
router.patch('/coupons/:couponId', authenticate, apiCouponsValidator.validateParamsCoupon, apiCouponsController.patchCoupon)
router.delete('/coupons/:couponId', authenticate, apiCouponsController.deleteCoupon)

module.exports = router

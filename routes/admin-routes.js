const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin-controller')

// General
const auth = require('../middleware/auth')

router.use(auth.isAdmin)

// interesting, I can chain handles after the route. I can use that if I want the access to be more granular
router.get('/', adminController.getDashboard)

// Customize
router.get('/customize', adminController.getCustomize)
router.post('/customize', adminController.postCustomize)

// Categories
router.get('/categories', adminController.getCategories)
router.get('/categories/new', adminController.getNewCategory)
router.get('/categories/:categoryId', adminController.getEditCategory)

// Products
router.get('/products', adminController.getProducts)
router.get('/products/new', adminController.getCreateProduct)
router.get('/products/:productId', adminController.getEditProduct)

// Groups
router.get('/groups/new', adminController.getCreateGroup)
router.get('/groups/:groupId', adminController.getEditGroup)

// Orders
router.get('/orders', adminController.getOrders)
router.get('/orders/:orderId', adminController.getOrder)

// Users
router.get('/users', adminController.getUsers)

// Pages
router.get('/pages', adminController.getPages)
router.get('/pages/create', adminController.getPageCreation)
router.get('/pages/:pageId', adminController.getPageEdition)

// Marketing
router.get('/marketing', adminController.getMarketing)

// Coupons
router.get('/coupons/new', adminController.getCreateCoupon)
router.get('/coupons/:couponId', adminController.getEditCoupon)

module.exports = router

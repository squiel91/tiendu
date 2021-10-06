const express = require('express')
const router = express.Router()

// Authentication
const { isUser, isAdmin } = require('../controllers/access-controller')

// Controllers
const accessController = require('../controllers/access-controller')
const customizationController = require('../controllers/customization-controller')
const productsController = require('../controllers/products-controller')
const recommendationsController = require('../controllers/recommendations-controller')
const categoriesController = require('../controllers/categories-controller')
const ordersController = require('../controllers/orders-controller')
const pagesController = require('../controllers/pages-controller')
const postsController = require('../controllers/posts-controller')
const usersController = require('../controllers/users-controller')
const subscriptionsController = require('../controllers/subscriptions-controller')
const couponsController = require('../controllers/coupons-controller')
const subscribersController = require('../controllers/subscriptions-controller')
const cartController = require('../controllers/cart-controller')
const checkoutController = require('../controllers/checkout-controller')
const ImagesController = require('../controllers/images-controller')

// Validators
const accessValidator = require('../controllers/validators/access-validator')
const adminValidator = require('../controllers/validators/admin-validator')
const productsValidator = require('../controllers/validators/products-validator')
const categoriesValidator = require('../controllers/validators/categories-validator')
const pagesValidator = require('../controllers/validators/pages-validator')
const postsValidator = require('../controllers/validators/posts-validator')
const couponsValidator = require('../controllers/validators/coupons-validator')
const checkoutValidator = require('../controllers/validators/checkout-validator')
const subscribersValidator = require('../controllers/validators/subscribers-validator')

// Access
router.get('/account', accessController.getAccount)
router.post('/account/register', accessValidator.postRegister, accessController.postRegister)
router.post('/account/login', accessValidator.postLogin, accessController.postLogin)
router.post('/account/request-password-reset', accessValidator.postRequestPasswordReset, accessController.postRequestPasswordReset)
router.post('/account/reset-password', accessValidator.postPasswordReset, accessController.postPasswordReset)

// User
router.get('/users/exist', usersController.getEmailExist)
router.get('/users',  isAdmin, usersController.getUsers)
router.get('/users/:userId', isAdmin, usersController.getUser)
router.post('/users', isAdmin, adminValidator.postUser, usersController.postUser)
router.patch('/users/:userId', isAdmin, usersController.patchUser)
router.delete('/users/:userId', isAdmin, usersController.deleteUser)


// Customization
router.get('/customization/home-categories', customizationController.getHomeCategories)
router.get('/customization', customizationController.getCustomization)
router.post('/customization', customizationController.postCustomization)

// Categories
router.get('/categories', categoriesController.getCategories)
router.get('/categories/:categoryId', categoriesController.getCategory)
router.post('/categories', isAdmin, categoriesValidator.postCategory, categoriesController.postCategory)
router.patch('/categories/:categoryId', isAdmin, categoriesValidator.patchCategory, categoriesController.patchCategory)
router.delete('/categories/:categoryId', isAdmin, categoriesController.deleteCategory)

// Product
router.get('/products', productsController.getProducts)
router.get('/products/:productId', productsController.getProduct)
router.post('/products', isAdmin, productsValidator.validateProduct, productsController.postProduct)
router.patch('/products/:productId', isAdmin, productsValidator.validateProduct, productsController.patchProduct)
router.post('/products/:productId/reviews', isUser, productsValidator.postProductReview, productsController.postProductReview)
router.delete('/products/:productId', isAdmin, productsController.deleteProduct)
router.get('/reviews', productsController.getReviews)

// Recommendations
router.get('/recommendations/products', recommendationsController.getProductRecommendations)
router.get('/recommendations/products/:productId', recommendationsController.getProductRecommendations)

// Cart
router.post('/cart', cartController.addItemToCart, cartController.retriveCart)

// Checkout
router.post('/cart/checkout', checkoutValidator.postCheckout, checkoutController.postCheckout)

// Subscribe
router.post('/subscriptions', subscribersValidator.postSubscriptions, subscribersController.postSubscriptions) 
router.get('/subscriptions',  isAdmin, subscriptionsController.getSubscriptions)

// Pages
router.get('/pages', pagesController.getPages)
router.get('/pages/:pageId', pagesController.getPage)
router.post('/pages', isAdmin, pagesValidator.postPage, pagesController.postPage)
router.patch('/pages/:pageId', isAdmin, pagesValidator.patchPage, pagesController.patchPage)
router.delete('/pages/:pageId', isAdmin, pagesController.deletePage)

// Blog posts
router.get('/posts', postsController.getPosts)
router.get('/posts/:postId', postsController.getPost)
router.post('/posts', isAdmin, postsValidator.postPost, postsController.postPost)
router.patch('/posts/:postId', isAdmin, postsValidator.patchPost, postsController.patchPost)
router.delete('/posts/:postId', isAdmin, postsController.deletePost)

// Orders
router.get('/orders', isAdmin, ordersController.getOrders)
router.get('/orders/:orderId', ordersController.getOrder)
router.post('/orders/:orderId', isAdmin, ordersController.postOrder)
router.patch('/orders/:orderId', isAdmin, ordersController.patchOrder)
router.delete('/orders/:orderId', isAdmin, ordersController.deleteOrder)

// Coupons
router.get('/coupons', isAdmin, couponsController.getCoupons)
router.get('/coupons/:couponId', couponsController.getCoupon)
router.post('/coupons', isAdmin, couponsValidator.validateParamsCoupon, couponsController.postCoupon)
router.patch('/coupons/:couponId', isAdmin, couponsValidator.validateParamsCoupon, couponsController.patchCoupon)
router.delete('/coupons/:couponId', isAdmin, couponsController.deleteCoupon)

// Images
router.get('/images', ImagesController.getImages)
router.post('/images', isAdmin, ImagesController.saveToFS, ImagesController.resizeImage, ImagesController.postImages)
router.patch('/images/:imageId', isAdmin, ImagesController.patchImages)
router.delete('/images/:imageId', isAdmin, ImagesController.deleteImages)

router.use((req, res, next) => {
  res.status(404).json({
    error: 'invalid api endpoint'
  })
})

module.exports = router

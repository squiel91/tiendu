const express = require('express')
const router = express.Router()

const accessApiValidator = require('../controllers/validators/api-access-validator')
const accessApiController = require('../controllers/api-access-controller')

router.post('/account/register', accessApiValidator.postRegister, accessApiController.postRegister)
router.post('/account/login', accessApiValidator.postLogin, accessApiController.postLogin)
router.post('/account/logout', accessApiController.postLogout)
router.post('/account/request-password-reset', accessApiValidator.postRequestPasswordReset, accessApiController.postRequestPasswordReset)
router.post('/account/reset-password', accessApiValidator.postPasswordReset, accessApiController.postPasswordReset)

module.exports = router

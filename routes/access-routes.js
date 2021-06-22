const express = require('express')
const router = express.Router()

const accessController = require('../controllers/access-controller')

router.use(accessController.setupAuth) // loads the user if logged

router.get('/cuenta/registrarse', accessController.getRegister)
router.get('/cuenta/ingresar', accessController.getLogin)
router.get('/cuenta', accessController.getAccount)
router.get('/cuenta/restablecer', accessController.getRequestPasswordReset)
router.get('/cuenta/restablecer/:resetToken', accessController.getPasswordReset) // from the email

module.exports = router

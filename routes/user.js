const express = require('express');
const userController = require('../controller/userController')
const router = express.Router()
const middleware = require('../middlewares/mid_auth')

router.get('/',middleware.isLogin,userController.loadHome)
router.get('/user/auth',middleware.isLogin,userController.showLogin)
router.post('/user/login',userController.userLogin)
router.get('/user/dashboard',middleware.checkSession,userController.showDashborad)
router.post('/user/register',userController.registerUser)
router.get('/user/logout',middleware.checkSession,userController.logout)

module.exports = router;
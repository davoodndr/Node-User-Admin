const express = require('express');
const router = express.Router()
const adminController = require('../controller/adminController')
const middleware = require('../middlewares/admin_middleware')

router.get('/login',middleware.isLogin,adminController.loadLogin)
router.post('/login',adminController.adminLogin)
router.get('/dashboard',middleware.checkSession,adminController.adminDashboard)
router.post('/update-user',adminController.updateUser)
router.post('/add-user',adminController.addUser)
router.get('/delete-user/:id',adminController.deleteUser)
router.get('/logout',adminController.logout)
router.post('/search',adminController.search)
module.exports = router;
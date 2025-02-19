const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register-resto-owner', authController.registerRestoOwner);
router.post('/register-super-admin', authController.registerSuperAdmin);
router.post('/register-restaurant', authController.registerRestaurant);
router.post('/super-admin/login', authController.superAdminLogin);
router.post('/admin/login', authController.adminLogin);
router.post('/user/login', authController.userLogin);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');


router.get('/menu_items', userController.getMenuItems); 
router.patch('/update-profile', userController.updateProfile); 
router.get('/get-restaurants', userController.getRestaurants); 



module.exports = router;

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, menuController.getAllItems);
router.get('/category/:category', auth, menuController.getItemsByCategory);
router.get('/menu-items/:id', auth, menuController.getMenuItemById);
router.get('/menu-items/restaurant/:id', menuController.getMenuItemsByRestaurant);

module.exports = router;

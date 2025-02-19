const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/add-to-cart', authMiddleware, cartController.addToCart);
router.get('/cart/:user_id', authMiddleware, cartController.getCartItems);
router.put("/update-quantity",authMiddleware, cartController.updateCartItemQuantity);

module.exports = router;

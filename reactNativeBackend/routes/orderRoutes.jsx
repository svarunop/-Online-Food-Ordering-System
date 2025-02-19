const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/place-order', authMiddleware, orderController.placeOrder);
router.get('/order/:order_id', authMiddleware, orderController.getOrderDetails);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

// Ensure all methods are correctly referenced
router.get('/dashboard', authMiddleware, adminController.getDashboard);
router.post('/add-menu-item', authMiddleware, adminController.addMenuItem);
router.put('/update-menu-item/:item_id', authMiddleware, adminController.updateMenuItem);
// router.put('/update-menu-item-availability', authMiddleware, adminController.updateMenuItemAvailability);
router.delete('/delete-menu-item/:item_id', authMiddleware, adminController.deleteMenuItem);
router.get('/orders/:restaurant_id', authMiddleware, adminController.getOrders);
router.put('/update-order-status', authMiddleware, adminController.updateOrderStatus); // Ensure this method is defined
router.get('/restaurant/:admin_id', authMiddleware, adminController.getRestaurantDetails);
router.get('/menu/:restaurant_id', authMiddleware, adminController.getMenuItems);

module.exports = router;

const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');

router.get('/notification',superAdminController.getNotifications);
router.get('/requests', superAdminController.getRequests);
router.put('/approve-request/:resto_id', superAdminController.approveRequest);
router.put('/reject-request/:resto_id', superAdminController.rejectRequest);
router.post('/push-notification', superAdminController.pushNotification);
router.post('/register-restaurant', superAdminController.registerRestaurant);
router.post('/register-resto-owner', superAdminController.registerRestoOwner);
router.post('/send-promo-notification', superAdminController.sendPromoNotification);


module.exports = router;

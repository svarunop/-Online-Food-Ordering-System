const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Route to fetch active notifications
router.get("/", notificationController.getActiveNotifications);

module.exports = router;

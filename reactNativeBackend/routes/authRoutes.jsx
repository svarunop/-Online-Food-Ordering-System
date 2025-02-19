const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure the correct path

console.log(authController); // Debugging step to check if functions are loaded

router.post('/register', authController.registerUser); // Ensure this function is defined
router.post('/login', authController.userLogin); // Ensure this function is defined

module.exports = router;

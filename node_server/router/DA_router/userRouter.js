const express = require('express');
const router = express.Router();
const userController = require('../../controller/DA_controller/usercontroller');

//add user
router.post('/adminregister', userController.registerAdmin)

// New route to get admin data
router.get('/admins', userController.getAdmins);

// a route to update an admin by ID
router.put('/admin/:id', userController.updateAdmin);

// Backend API route for deleting an admin by ID
router.delete('/admin/:id', userController.deleteAdmin);
// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Forgot Password - Get user's password by username
router.post('/forgot-password', userController.forgotPassword);

module.exports = router;

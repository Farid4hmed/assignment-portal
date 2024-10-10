const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema, assignmentSchema } = require('../validators/schemas');

// User registration route
router.post('/register', validateBody(registerSchema), userController.registerUser);

// User login route
router.post('/login', validateBody(loginSchema), userController.loginUser);

// Upload assignment (requires authentication)
router.post('/upload', ensureAuthenticated, validateBody(assignmentSchema), userController.uploadAssignment);

// Get list of all admins (requires authentication)
router.get('/admins', ensureAuthenticated, userController.getAllAdmins);

module.exports = router;
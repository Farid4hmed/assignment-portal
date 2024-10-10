const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const { ensureAuthenticated, authorizeAdmin } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../validators/schemas');

// Admin registration route
router.post('/register', validateBody(registerSchema), adminController.registerAdmin);

// Admin login route
router.post('/login', validateBody(loginSchema), adminController.loginAdmin);

// Protect routes below with authentication and admin authorization
router.use(ensureAuthenticated, authorizeAdmin);

// View all assignments
router.get('/assignments', adminController.viewAssignments);

// Accept an assignment
router.post('/assignments/:id/accept', adminController.acceptAssignment);

// Reject an assignment
router.post('/assignments/:id/reject', adminController.rejectAssignment);

module.exports = router;
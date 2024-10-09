const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated, authorizeAdmin } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../validators/schemas');

router.post('/register', validateBody(registerSchema), adminController.registerAdmin);

router.post('/login', validateBody(loginSchema), adminController.loginAdmin);

router.use(ensureAuthenticated, authorizeAdmin);

router.get('/assignments', adminController.viewAssignments);

router.post('/assignments/:id/accept', adminController.acceptAssignment);

router.post('/assignments/:id/reject', adminController.rejectAssignment);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema, assignmentSchema } = require('../validators/schemas');


router.post('/register', validateBody(registerSchema), userController.registerUser);


router.post('/login', validateBody(loginSchema), userController.loginUser);


router.post('/upload', ensureAuthenticated, validateBody(assignmentSchema), userController.uploadAssignment);


router.get('/admins', ensureAuthenticated, userController.getAllAdmins);

module.exports = router;

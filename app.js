// app.js

// Initialize Application
const express = require('express');
const app = express();
app.use(express.json());

// Use Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Use Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// Use Error Handlers
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Export the app
module.exports = app;

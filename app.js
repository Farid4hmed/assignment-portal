const express = require('express');
const app = express();

app.use(express.json()); // Enable parsing of JSON bodies

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

// Set up routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

module.exports = app;
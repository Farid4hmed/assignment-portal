const express = require('express');

const dotenv = require('dotenv');

const initDB = require("./config/db.js");
initDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/', userRoutes);    
app.use('/admin', adminRoutes); 

app.get('/health', (req, res) => {
    res.send({
        time: new Date(),
        status: "Active"
    });
});


// Error handling middleware (should be defined after all routes)
app.use(errorHandler);


const port = process.env.PORT || 3000;
const host = process.env.HOST || `localhost`;

app.listen(port, () => {
    console.log(`Server is up and running at http://${host}:${port}`);
});
//Initialize Application
const express = require('express');
const app = express();
app.use(express.json());

//Use Enviornment Variables
const dotenv = require('dotenv');
dotenv.config();


//Initialize DB
const initDB = require("./config/db.js");
initDB();


//health API
app.get('/health', (req, res) => {
    res.send({
        time: new Date(),
        status: "Active"
    });
});


//Use routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', userRoutes);    
app.use('/admin', adminRoutes); 



// Use error handlers
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);







const port = process.env.PORT || 3000;
const host = process.env.HOST || `localhost`;

app.listen(port, () => {
    console.log(`Server is up and running at http://${host}:${port}`);
});
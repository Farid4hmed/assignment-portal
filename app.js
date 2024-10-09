const express = require('express');
const app = express();
const initDB = require("./config/db.js");


initDB();

app.get('/health', (req, res) => {
    res.send({
        time: new Date(),
        status: "Active"
    });
});




// route not found middleware
app.use((req, res, next) =>
    res.status(404).send("You are looking for something that we do not have!")
);


const port = process.env.PORT || 3000;
const host = process.env.HOST || `localhost`;

app.listen(port, () => {
    console.log(`Server is up and running at http://${host}:${port}`);
});
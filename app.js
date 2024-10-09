const express = require('express');
const app = express();
const initDB = require("./config/db.js");


initDB();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


const port = process.env.PORT || 3000;
const host = process.env.HOST || `localhost`;

app.listen(port, () => {
    console.log(`Server is up and running at http://${host}:${port}`);
});
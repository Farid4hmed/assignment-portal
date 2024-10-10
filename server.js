// server.js

const app = require('./app');

// Initialize Database
const initDB = require('./config/db');
initDB();

// Start the Server
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server is up and running at http://${host}:${port}`);
});

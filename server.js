const app = require('./app');
const initDB = require('./config/db');

initDB(); // Initialize database

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server is up and running at http://${host}:${port}`);
});
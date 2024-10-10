const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['User', 'Admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);
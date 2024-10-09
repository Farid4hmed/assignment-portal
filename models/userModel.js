const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  googleId: { type: String },
  password: { type: String },
  role: { type: String, enum: ['User', 'Admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);

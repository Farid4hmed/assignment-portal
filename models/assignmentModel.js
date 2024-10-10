const mongoose = require('mongoose');

// Define the Assignment schema
const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who uploaded the assignment
  task: { type: String, required: true }, // Task description
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assigned admin
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // Assignment status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
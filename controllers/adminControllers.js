const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (existingUser.role === 'User') {
        return res.status(400).json({ error: 'You are registered as a User' });
      } else if (existingUser.role === 'Admin') {
        return res.status(400).json({ error: 'Admin already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ username, password: hashedPassword, role: 'Admin' });
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await User.findOne({ username, role: 'Admin' });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.viewAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ adminId: req.user.id })
      .populate('userId', 'username')
      .sort('-createdAt');
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

exports.acceptAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    if (assignment.adminId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    assignment.status = 'Accepted';
    await assignment.save();
    res.json({ message: 'Assignment accepted' });
  } catch (err) {
    next(err);
  }
};

exports.rejectAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    if (assignment.adminId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    assignment.status = 'Rejected';
    await assignment.save();
    res.json({ message: 'Assignment rejected' });
  } catch (err) {
    next(err);
  }
};

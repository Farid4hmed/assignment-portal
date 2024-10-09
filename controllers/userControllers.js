const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: 'User' });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, role: 'User' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.uploadAssignment = async (req, res, next) => {
    try {
      const { task, adminId } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(400).json({ error: 'Invalid admin ID' });
      }
  
      const admin = await User.findOne({ _id: adminId, role: 'Admin' });
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      const existingAssignment = await Assignment.findOne({
        userId: req.user.id,
        adminId: adminId,
        task: task,
      });
  
      if (existingAssignment) {
        return res.status(400).json({ error: 'Task already exists' });
      }
  
      const assignment = new Assignment({
        userId: req.user.id,
        task,
        adminId,
      });
  
      await assignment.save();
  
      res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (err) {
      next(err);
    }
  };

exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: 'Admin' }, 'username');
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

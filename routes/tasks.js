// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Add a new task to a user
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { text, completed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newTask = new Task({ text, completed, user: userId });
    await newTask.save();

    user.tasks.push(newTask._id);
    await user.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

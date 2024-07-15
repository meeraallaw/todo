const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const jwtMiddleware = require('../middleware/jwtMiddleware');

// GET /todo/:itemId - Get todo item by ID
router.get('/:itemId', jwtMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.itemId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /todo - Create new todo item
router.post('/', jwtMiddleware, async (req, res) => {
  try {
    const { userId, message } = req.body;
    const todo = new Todo({
      userId,
      message,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /todo/:itemId - Update todo item by ID
router.put('/:itemId', jwtMiddleware, async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.itemId,
      { completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /todo/:itemId - Delete todo item by ID
router.delete('/:itemId', jwtMiddleware, async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.itemId);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.json({ message: 'Successfully deleted the required todo item.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

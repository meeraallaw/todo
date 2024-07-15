const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', todoSchema);

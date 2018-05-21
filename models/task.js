const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
  },
  description: {
    type: String,
    unique: false,
    required: false,
  },
  created: {
    type: Number,
    unique: false,
    required: true,
  },
  due: {
    type: Number,
    unique: false,
    required: true,
  },
  completed: {
    type: Boolean,
    unique: false,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);

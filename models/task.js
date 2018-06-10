const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    default: ''
  },
  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section',
    index: true
  },
  description: {
    type: String,
    unique: false,
    default: ''
  },
  created: {
    type: Number,
    unique: false,
    required: true,
  },
  due: {
    type: Number,
    unique: false,
    default: null,
  },
  completed: {
    type: Boolean,
    unique: false,
    default: false,
  },
});

module.exports = mongoose.model('Task', taskSchema);

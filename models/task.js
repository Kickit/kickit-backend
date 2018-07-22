const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    default: ''
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    index: true
  },
  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
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
  position: {
    type: String,
    unique: false,
    default: ''
  },
});

module.exports = mongoose.model('Task', taskSchema);

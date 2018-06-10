const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    index: true
  },
  task: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
    index: true
  },
  position: {
    type: Number,
    unique: false,
    required: true,
  },
});

module.exports = mongoose.model('Section', sectionSchema);

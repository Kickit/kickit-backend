const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);

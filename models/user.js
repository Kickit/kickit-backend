const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  first: {
    type: String,
    unique: false,
    required: true,
  },
  last: {
    type: String,
    unique: false,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  projects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' }]
});

module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
  },
  created: {
    type: Number,
    unique: false,
    required: true,
  },
  public: {
    type: String,
    enum: ['NONE', 'READ', 'READ/WRITE'],
    default: 'NONE',
    unique: false,
  },
  owners: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
});

module.exports = mongoose.model('Project', projectSchema);

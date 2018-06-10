

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
  sections: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section' 
  }],
  owners: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  }]
});

module.exports = mongoose.model('Project', projectSchema);

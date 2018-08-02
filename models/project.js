

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

projectSchema.pre('remove', function(next) {
    // Delete all project tasks prior to deleting the project
    this.model('Task').remove({project: this._id}, next)
});

module.exports = mongoose.model('Project', projectSchema);

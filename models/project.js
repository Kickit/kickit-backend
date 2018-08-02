

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

// TODO: Make sure that this actually goes ahead and deletes at the tasks
// TODO: Investigate whether or not we would want to do it all sequentially vs. in parallel
projectSchema.pre('remove', function(next) {
    console.log(this)
    this.model('Task').remove({project: this._id}, next)
});

module.exports = mongoose.model('Project', projectSchema);

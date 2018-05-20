const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
  },
});

module.exports = mongoose.model('Section', sectionSchema);

const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  img: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Prop', propSchema);
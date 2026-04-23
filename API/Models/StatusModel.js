const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  color: {
    type: String,
    required: true,
    trim: true,
    match: /^#([0-9A-Fa-f]{6})$/
  }

});

module.exports = mongoose.model('status', propSchema);
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  hex: {
    type: String,
    required: true,
    trim: true,
    match: /^#([0-9A-Fa-f]{6})$/
  }

});

module.exports = mongoose.model('Color', colorSchema);
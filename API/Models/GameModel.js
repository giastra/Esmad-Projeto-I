const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  x: {
    type: Number,
    required: true,
    default: 0
  },

  y: {
    type: Number,
    required: true,
    default: 0
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
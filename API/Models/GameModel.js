const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  x: {
    type: Number,
    required: true
  },

  y: {
    type: Number,
    required: true
  }

}, {
  timestamps: true
});

gameSchema.index({ user: 1, x: 1, y: 1 }, { unique: true });

module.exports = mongoose.model('Game', gameSchema);
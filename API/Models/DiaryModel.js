const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  note: {
    type: String,
    required: true
  },

  eventDate: {
    type: Date,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

diarySchema.index({ user: 1, eventDate: 1 }, { unique: true });

module.exports = mongoose.model('Diary', diarySchema);
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  note: {
    type: String,
    required: true,
    trim: true
  },

  eventDate: {
    type: Date,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiaryCategory',
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Diary', diarySchema);
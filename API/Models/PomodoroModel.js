const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Classic Pomodoro'
  },
  focusTime: {
    type: Number,
    required: true,
    min: 1,
    default: 25
  },
  shortBreak: {
    type: Number,
    required: true,
    min: 1,
    default: 5
  },
  longBreak: {
    type: Number,
    required: true,
    min: 1,
    default: 15
  },
  cycles: {
    type: Number,
    required: true,
    min: 1,
    default: 4
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Pomodoro', pomodoroSchema);
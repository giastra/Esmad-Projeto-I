const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user']
  },
  activePomodoro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pomodoro',
    default: null
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
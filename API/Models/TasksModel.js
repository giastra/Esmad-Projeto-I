const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true,
    default: ''
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date
  },

  status: {
    type: Boolean,
    default: false
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskCategory',
    required: true
  },
    status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'status',
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
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
    type: String,
    enum: ['por_fazer', 'concluida'],
    default: 'por_fazer'
  },

  priority: {
    type: String,
    enum: ['alta', 'normal', 'baixa'],
    default: 'normal'
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
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
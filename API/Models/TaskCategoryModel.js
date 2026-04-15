const mongoose = require('mongoose');

const taskCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: true
  }

});

module.exports = mongoose.model('TaskCategory', taskCategorySchema);
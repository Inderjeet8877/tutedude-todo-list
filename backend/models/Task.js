const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // Need to make title required so empty tasks aren't saved
      required: true, 
    },
    description: {
      type: String,
      // Same for description, we want details
      required: true,
    },
    status: {
      type: String,
      // Status should only be pending or completed
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);

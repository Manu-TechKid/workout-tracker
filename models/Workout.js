// Workout model for CRUD operations
// This is the main collection for the workout tracker application

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    required: true,
    enum: ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other'],
    default: 'Other'
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 480 // 8 hours max
  },
  intensity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  calories: {
    type: Number,
    min: 0,
    max: 2000
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
workoutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search functionality
workoutSchema.index({
  title: 'text',
  description: 'text',
  type: 'text',
  notes: 'text'
});

module.exports = mongoose.model('Workout', workoutSchema);

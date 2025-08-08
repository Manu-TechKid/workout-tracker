// Database configuration file
// This file stores MongoDB connection credentials separately from app.js
// as required by the assignment specifications

require('dotenv').config();

const mongoose = require('mongoose');

// Database connection configuration
const connectDB = async () => {
  try {
    // Use environment variables for database credentials
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workout-tracker';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

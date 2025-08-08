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
    
    // Connection options for better reliability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };
    
    await mongoose.connect(mongoURI, options);
    
    console.log('MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Connection string:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    process.exit(1);
  }
};

module.exports = connectDB;

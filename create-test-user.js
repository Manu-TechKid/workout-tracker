require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      console.log('Test user already exists, deleting...');
      await User.deleteOne({ username: 'testuser' });
    }
    
    // Create new test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      provider: 'local'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('Email: test@example.com');
    
    // Verify the user was created
    const savedUser = await User.findOne({ username: 'testuser' });
    console.log('User saved:', savedUser.username, savedUser.email);
    
    // Test password comparison
    const isMatch = await savedUser.comparePassword('password123');
    console.log('Password test:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    await mongoose.connection.close();
    console.log('\n✅ Test user creation completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();

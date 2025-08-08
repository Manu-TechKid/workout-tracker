require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if users exist
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database:`);
    
    users.forEach(user => {
      console.log(`- Username: ${user.username}, Email: ${user.email}, Provider: ${user.provider}`);
    });
    
    // Test password comparison
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n🧪 Testing password comparison for user: ${testUser.username}`);
      
      // Test with a common password
      const testPasswords = ['password123', 'test123', '123456', 'password'];
      
      for (const testPassword of testPasswords) {
        try {
          const isMatch = await testUser.comparePassword(testPassword);
          console.log(`Password "${testPassword}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
          if (isMatch) {
            console.log(`🎉 Found working password: "${testPassword}" for user: ${testUser.username}`);
            break;
          }
        } catch (error) {
          console.log(`Password "${testPassword}": Error - ${error.message}`);
        }
      }
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();

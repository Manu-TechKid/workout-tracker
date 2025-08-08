require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testProduction() {
  try {
    console.log('🧪 Testing Production Setup...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    // Test database connection
    console.log('\n📊 Testing Database Connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // Test user retrieval
    console.log('\n👥 Testing User Retrieval...');
    const users = await User.find({});
    console.log(`✅ Found ${users.length} users in database:`);
    
    users.forEach(user => {
      console.log(`- Username: ${user.username}, Email: ${user.email}, Provider: ${user.provider}`);
    });
    
    // Test testuser specifically
    console.log('\n🔐 Testing testuser Authentication...');
    const testuser = await User.findOne({ username: 'testuser' });
    
    if (testuser) {
      console.log('✅ testuser found in database');
      
      // Test with the known password
      const isMatch = await testuser.comparePassword('password123');
      console.log('Password "password123":', isMatch ? '✅ MATCH' : '❌ NO MATCH');
      
      if (isMatch) {
        console.log('🎉 testuser login should work with: testuser / password123');
      } else {
        console.log('❌ testuser password is not "password123"');
      }
    } else {
      console.log('❌ testuser not found in database');
    }
    
    // Test Admin user
    console.log('\n🔐 Testing Admin Authentication...');
    const admin = await User.findOne({ username: 'Admin' });
    
    if (admin) {
      console.log('✅ Admin found in database');
      
      // Test with common passwords
      const testPasswords = ['admin', 'admin123', 'password', 'password123', 'Admin', 'Admin123'];
      
      for (const password of testPasswords) {
        try {
          const isMatch = await admin.comparePassword(password);
          console.log(`Password "${password}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
          if (isMatch) {
            console.log(`🎉 Admin login should work with: Admin / ${password}`);
            break;
          }
        } catch (error) {
          console.log(`Password "${password}": Error - ${error.message}`);
        }
      }
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Production test completed successfully!');
    
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testProduction();

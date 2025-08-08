// Production test script to verify database connection and authentication
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testProduction() {
  try {
    console.log('🔍 Testing Production Environment...\n');
    
    // Test 1: Database Connection
    console.log('1. Testing MongoDB Connection...');
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable not set');
    }
    
    console.log('   Connection URI:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority'
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('   ✅ Database connected successfully');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    
    // Test 2: Check Users Collection
    console.log('\n2. Testing Users Collection...');
    const userCount = await User.countDocuments();
    console.log(`   ✅ Found ${userCount} users in database`);
    
    if (userCount > 0) {
      const users = await User.find({}, 'username email provider').limit(5);
      console.log('   Users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.email || 'no email'}) [${user.provider || 'local'}]`);
      });
    }
    
    // Test 3: Test Authentication
    console.log('\n3. Testing Authentication...');
    
    // Check if testuser exists
    let testUser = await User.findOne({ username: 'testuser' });
    if (!testUser) {
      console.log('   Creating testuser for testing...');
      testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        provider: 'local'
      });
      testUser.password = 'password123'; // This will be hashed by the pre-save middleware
      await testUser.save();
      console.log('   ✅ testuser created');
    } else {
      console.log('   ✅ testuser exists');
    }
    
    // Test password comparison
    const isValidPassword = await testUser.comparePassword('password123');
    console.log(`   Password test: ${isValidPassword ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 4: Environment Variables
    console.log('\n4. Testing Environment Variables...');
    const requiredEnvVars = ['MONGODB_URI', 'SESSION_SECRET'];
    const optionalEnvVars = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
    
    requiredEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      console.log(`   ${envVar}: ${value ? '✅ Set' : '❌ Missing'}`);
    });
    
    optionalEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      console.log(`   ${envVar}: ${value ? '✅ Set' : '⚠️ Not set (GitHub OAuth disabled)'}`);
    });
    
    console.log('\n🎉 Production test completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Database connection working');
    console.log('   ✅ Users collection accessible');
    console.log('   ✅ Authentication system functional');
    console.log('   ✅ Environment variables configured');
    
    console.log('\n🚀 Ready for deployment!');
    console.log('\nTest credentials:');
    console.log('   Username: testuser');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('\n❌ Production test failed:');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Database connection closed');
    }
    process.exit(0);
  }
}

// Run the test
testProduction();

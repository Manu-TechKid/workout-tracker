# Render Deployment Guide - Workout Tracker

## 🚀 Quick Fix for Current Issues

### Issues Fixed:
1. ✅ **MongoDB Connection Error**: Removed deprecated `bufferMaxEntries` option
2. ✅ **Session Configuration**: Improved for production environment
3. ✅ **Environment Variables**: Added comprehensive setup guide

## 📋 Required Environment Variables on Render

### **CRITICAL - Set these in Render Dashboard:**

1. **Go to your Render service dashboard**
2. **Click "Environment" tab**
3. **Add these environment variables:**

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/workout-tracker?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
```

### **Optional (for GitHub OAuth):**
```
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=https://workout-tracker-6y41.onrender.com/auth/github/callback
```

## 🔧 Step-by-Step Render Setup

### 1. Environment Variables Setup
- **MONGODB_URI**: Your MongoDB Atlas connection string
- **SESSION_SECRET**: A random secure string (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- **NODE_ENV**: Set to `production`

### 2. Build Settings (should already be configured)
- **Build Command**: `npm install`
- **Start Command**: `npm run start`
- **Node Version**: `>=14.0.0` (specified in package.json)

### 3. MongoDB Atlas Configuration
Ensure your MongoDB Atlas cluster allows connections from:
- **IP Address**: `0.0.0.0/0` (allow all IPs for Render)
- **Database User**: Has read/write permissions

## 🧪 Testing the Deployment

### Run Local Test First:
```bash
node test-production.js
```

This will verify:
- ✅ Database connection
- ✅ User authentication
- ✅ Environment variables
- ✅ Test user creation

### Expected Output:
```
🔍 Testing Production Environment...

1. Testing MongoDB Connection...
   ✅ Database connected successfully

2. Testing Users Collection...
   ✅ Found X users in database

3. Testing Authentication...
   ✅ testuser exists
   Password test: ✅ PASS

4. Testing Environment Variables...
   MONGODB_URI: ✅ Set
   SESSION_SECRET: ✅ Set

🎉 Production test completed successfully!
```

## 🔐 Test Credentials

After deployment, you can log in with:
- **Username**: `testuser`
- **Password**: `password123`

Or create a new account through the registration page.

## 🐛 Troubleshooting

### If you still get "MongoDB connection error":
1. Check that `MONGODB_URI` is set correctly in Render environment variables
2. Verify MongoDB Atlas allows connections from `0.0.0.0/0`
3. Ensure database user has proper permissions

### If sessions don't work:
1. Verify `SESSION_SECRET` is set in Render environment variables
2. Check that MongoDB connection is working (sessions are stored in MongoDB)

### If GitHub OAuth doesn't work:
1. This is optional - the app works without it
2. Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` if needed

## 📊 Deployment Status Check

After deployment, visit these URLs to verify:
- **Main App**: `https://workout-tracker-6y41.onrender.com`
- **Debug Info**: `https://workout-tracker-6y41.onrender.com/debug`
- **Login Page**: `https://workout-tracker-6y41.onrender.com/auth/login`

## 🔄 Redeployment

After making these changes:
1. Commit and push to GitHub
2. Render will automatically redeploy
3. Check the build logs for any errors
4. Test the login functionality

## 📝 What Changed

### Fixed Files:
- **`config/database.js`**: Removed deprecated MongoDB options
- **`app.js`**: Improved session configuration for production
- **`test-production.js`**: Added comprehensive testing script

### Key Improvements:
- ✅ Removed `bufferMaxEntries: 0` (deprecated)
- ✅ Added `retryWrites: true` and `w: 'majority'`
- ✅ Improved session cookie settings for production
- ✅ Added session touch optimization
- ✅ Better error handling and logging

# Deployment Guide - Workout Tracker

## Deploying to Render

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Workout Tracker CRUD Application"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/workout-tracker.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create Database Cluster**:
   - Choose the free tier (M0)
   - Select your preferred region
   - Create the cluster

3. **Configure Database Access**:
   - Go to Database Access
   - Create a new database user
   - Set username and password (save these!)

4. **Configure Network Access**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allows all IPs)

5. **Get Connection String**:
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Step 3: Set Up GitHub OAuth (Optional)

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Set Application name: "Workout Tracker"
   - Set Homepage URL: `https://your-app-name.onrender.com`
   - Set Authorization callback URL: `https://your-app-name.onrender.com/auth/github/callback`
   - Click "Register application"
   - Copy Client ID and Client Secret

### Step 4: Deploy to Render

1. **Create Render Account**:
   - Go to [Render](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**:
   - **Name**: `workout-tracker` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**:
   Click "Environment" tab and add these variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workout-tracker?retryWrites=true&w=majority
   SESSION_SECRET=your-super-secret-production-session-key
   NODE_ENV=production
   ```
   
   If you set up GitHub OAuth, also add:
   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=https://your-app-name.onrender.com/auth/github/callback
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for the build to complete
   - Your app will be available at `https://your-app-name.onrender.com`

### Step 5: Verify Deployment

1. **Test the Application**:
   - Visit your live URL
   - Test registration and login
   - Test CRUD operations
   - Test search functionality

2. **Check Logs**:
   - In Render dashboard, go to your service
   - Click "Logs" to monitor the application

### Troubleshooting

**Common Issues:**

1. **Build Fails**:
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible

2. **Database Connection Error**:
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Session Issues**:
   - Make sure SESSION_SECRET is set
   - Check that connect-mongo is properly configured

4. **GitHub OAuth Not Working**:
   - Verify callback URL matches exactly
   - Check Client ID and Secret are correct
   - Ensure OAuth app is properly configured

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `NODE_ENV` | Environment (production/development) | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | No |
| `GITHUB_CALLBACK_URL` | GitHub OAuth callback URL | No |

### Security Notes

1. **Never commit sensitive data**:
   - Keep .env file in .gitignore
   - Use environment variables for secrets

2. **Production Security**:
   - Use strong session secrets
   - Enable HTTPS (automatic on Render)
   - Regularly update dependencies

3. **Database Security**:
   - Use strong database passwords
   - Restrict network access when possible
   - Regularly backup data

### Monitoring

1. **Render Dashboard**:
   - Monitor application logs
   - Check resource usage
   - Set up alerts for downtime

2. **Application Monitoring**:
   - Add error logging
   - Monitor database performance
   - Track user activity

---

**Your application is now live and ready for use!** 🎉

Remember to update the live link in your README.md file once deployment is complete.

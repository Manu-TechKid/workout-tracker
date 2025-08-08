# Workout Tracker - CRUD Application

## COMP 2068 Assignment 2 - JavaScript Frameworks CRUD Application

A comprehensive workout tracking web application built with Node.js, Express, MongoDB, and Bootstrap. This application allows users to track their fitness journey with full CRUD (Create, Read, Update, Delete) functionality, authentication, and search capabilities.

## 🏃‍♂️ Live Application

**Live Link:** [Workout Tracker on Render](https://workout-tracker-crud.onrender.com)

## ✨ Features

### Core Requirements ✅
- **Home Page**: Professional splash screen with shared header/footer
- **Public Read-Only Listing**: View all workouts without authentication
- **Authentication**: Local + GitHub OAuth login, registration, and logout
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for authenticated users
- **Delete Confirmation**: Secure delete confirmation page
- **Database Configuration**: MongoDB credentials stored in separate config file
- **Code Comments**: Comprehensive code documentation
- **Deployment Ready**: Configured for Render deployment

### Additional Feature: Keyword Search 🔍
- **Search Functionality**: Advanced keyword search across workout titles, descriptions, types, and notes
- **Public Search**: Search through all public workouts
- **Private Search**: Authenticated users can search their own workouts
- **Real-time Results**: Instant search results with clear visual feedback

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Local + GitHub OAuth)
- **Frontend**: Handlebars (HBS), Bootstrap 5
- **Styling**: Custom CSS with modern gradients and animations
- **Icons**: Font Awesome
- **Deployment**: Render

## 📋 Project Structure

```
workout-tracker/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User model
│   └── Workout.js          # Workout model
├── routes/
│   ├── index.js            # Home page routes
│   ├── auth.js             # Authentication routes
│   └── workouts.js         # CRUD routes
├── views/
│   ├── layout.hbs          # Main layout template
│   ├── index.hbs           # Home page
│   ├── auth/
│   │   ├── login.hbs       # Login page
│   │   └── register.hbs    # Registration page
│   └── workouts/
│       ├── public.hbs      # Public workouts view
│       ├── index.hbs       # User dashboard
│       ├── new.hbs         # Add workout form
│       ├── edit.hbs        # Edit workout form
│       ├── show.hbs        # Workout details
│       └── delete.hbs      # Delete confirmation
├── public/
│   └── stylesheets/
│       └── style.css       # Custom styles
├── app.js                  # Main application file
├── package.json            # Dependencies
└── README.md              # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- GitHub account (for OAuth)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workout-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/workout-tracker
   SESSION_SECRET=your-super-secret-session-key
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
   NODE_ENV=development
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally, or
   - Use MongoDB Atlas (cloud database)

5. **GitHub OAuth Setup** (Optional)
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Set callback URL to `http://localhost:3000/auth/github/callback`
   - Copy Client ID and Client Secret to `.env` file

6. **Start the application**
   ```bash
   npm start
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🔐 Authentication Features

### Local Authentication
- User registration with email validation
- Secure password hashing with bcrypt
- Session-based authentication
- Protected routes for authenticated users

### GitHub OAuth
- One-click login with GitHub account
- Automatic user creation for new GitHub users
- Seamless integration with existing local accounts

## 📊 CRUD Operations

### Create
- Add new workouts with detailed information
- Form validation and error handling
- Support for various workout types

### Read
- Public read-only view of all workouts
- Private dashboard for authenticated users
- Detailed workout information display

### Update
- Edit existing workouts
- Form pre-populated with current data
- Validation and error handling

### Delete
- Secure delete confirmation page
- Warning messages and user confirmation
- Soft delete with proper cleanup

## 🔍 Search Functionality

The application includes advanced search capabilities:

- **Keyword Search**: Search across workout titles, descriptions, types, and notes
- **Public Search**: Search through all public workouts
- **Private Search**: Authenticated users can search their own workouts
- **Real-time Results**: Instant search results with clear visual feedback
- **Search History**: Maintains search query in form fields

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern Styling**: Custom CSS with gradients and animations
- **Professional Layout**: Clean, intuitive interface
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Loading States**: Visual feedback for user actions
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Render Deployment

1. **Connect Repository**
   - Link your GitHub repository to Render
   - Create a new Web Service

2. **Environment Variables**
   Set the following environment variables in Render:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   SESSION_SECRET=your-production-session-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=https://your-app-name.onrender.com/auth/github/callback
   NODE_ENV=production
   ```

3. **Build Command**
   ```
   npm install
   ```

4. **Start Command**
   ```
   npm start
   ```

## 📝 Code Quality

- **Comprehensive Comments**: All major functions and routes are documented
- **Error Handling**: Proper try-catch blocks and user feedback
- **Input Validation**: Server-side validation for all forms
- **Security**: Password hashing, session management, and route protection
- **Modular Structure**: Clean separation of concerns

## 🔧 Dependencies

### Core Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `passport`: Authentication middleware
- `passport-local`: Local authentication strategy
- `passport-github2`: GitHub OAuth strategy
- `express-session`: Session management
- `connect-mongo`: MongoDB session store
- `bcryptjs`: Password hashing
- `dotenv`: Environment variable management

### Development Dependencies
- `express-generator`: Project scaffolding
- `hbs`: Handlebars templating engine

## 📚 Learning Outcomes

This project demonstrates:

1. **Full-Stack Development**: Complete web application with frontend and backend
2. **Database Design**: MongoDB schema design and relationships
3. **Authentication Systems**: Multiple authentication strategies
4. **CRUD Operations**: Complete data management lifecycle
5. **Search Implementation**: Advanced search functionality
6. **Deployment**: Cloud deployment with environment configuration
7. **Code Organization**: Modular, maintainable code structure

## 🤝 Contributing

This is an academic project for COMP 2068. For educational purposes, feel free to:

- Study the code structure
- Implement similar features
- Use as a reference for Node.js/Express development

## 📄 License

This project is created for educational purposes as part of COMP 2068 Assignment 2.

## 👨‍💻 Author

**Student Name** - COMP 2068 JavaScript Frameworks

---

*Built with ❤️ using Node.js, Express, MongoDB, and Bootstrap*

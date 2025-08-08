// Main application file for Workout Tracker CRUD Application
// COMP 2068 Assignment 2 - JavaScript Frameworks CRUD Application

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const flash = require('connect-flash');

// Import database connection
const connectDB = require('./config/database');

// Import models
const User = require('./models/User');
const Workout = require('./models/Workout');

// Import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const workoutRouter = require('./routes/workouts');

const app = express();

// Connect to MongoDB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Handlebars helpers configuration
const hbs = require('hbs');

// Register helpers
hbs.registerHelper('eq', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatDate', function(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  } catch (error) {
    return '';
  }
});

hbs.registerHelper('formatDateForInput', function(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
});

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// GitHub OAuth Strategy (only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || (process.env.NODE_ENV === 'production' 
      ? "https://workout-tracker-6y41.onrender.com/auth/github/callback"
      : "http://localhost:3000/auth/github/callback")
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        // Create new user
        user = new User({
          username: profile.username,
          email: profile.emails[0].value,
          githubId: profile.id,
          provider: 'github'
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  console.log('GitHub OAuth strategy configured');
} else {
  console.log('GitHub OAuth credentials not provided - GitHub login disabled');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production' && process.env.NODE_ENV !== 'development',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());

// Make user and flash messages available to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  
  // Debug logging for authentication issues
  if (req.path === '/auth/login' || req.path === '/workouts') {
    console.log(`[${req.path}] User:`, req.user ? req.user.username : 'Not authenticated');
    console.log(`[${req.path}] isAuthenticated:`, req.isAuthenticated());
  }
  
  next();
});

// Debug route for testing
app.get('/debug', (req, res) => {
  res.json({
    message: 'Application is running',
    user: req.user ? { id: req.user._id, username: req.user.username } : null,
    isAuthenticated: req.isAuthenticated(),
    env: process.env.NODE_ENV,
    hasGitHubCredentials: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  });
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/workouts', workoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

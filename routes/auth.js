// Authentication routes
// Handles login, register, logout, and GitHub OAuth

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isNotAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Workout Tracker',
    error: req.flash('error')
  });
});

// Register POST
router.post('/register', isNotAuthenticated, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/auth/register');
    }
    
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/register');
    }
    
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/auth/register');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      req.flash('error', 'Username or email already exists');
      return res.redirect('/auth/register');
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      provider: 'local'
    });
    
    await user.save();
    
    req.flash('success_msg', 'Registration successful! Please log in.');
    res.redirect('/auth/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
});

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Workout Tracker',
    error: req.flash('error'),
    success: req.flash('success_msg')
  });
});

// Login POST
router.post('/login', isNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      req.flash('error', 'Authentication error occurred');
      return res.redirect('/auth/login');
    }
    
    if (!user) {
      console.log('Authentication failed:', info.message);
      req.flash('error', info.message || 'Invalid credentials');
      return res.redirect('/auth/login');
    }
    
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        req.flash('error', 'Login error occurred');
        return res.redirect('/auth/login');
      }
      
      console.log('User logged in successfully:', user.username);
      req.flash('success_msg', `Welcome back, ${user.username}!`);
      return res.redirect('/workouts');
    });
  })(req, res, next);
});

// GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/auth/login',
    failureFlash: true 
  }),
  (req, res) => {
    res.redirect('/workouts');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.flash('success_msg', 'You have been logged out successfully.');
    res.redirect('/');
  });
});

module.exports = router;

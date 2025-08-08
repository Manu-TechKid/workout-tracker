// Main index route - Home page splash screen
// Serves as the landing page for the Workout Tracker application

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Workout Tracker - Track Your Fitness Journey',
    isAuthenticated: req.isAuthenticated()
  });
});

module.exports = router;

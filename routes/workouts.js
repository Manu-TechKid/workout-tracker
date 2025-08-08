// Workout routes for CRUD operations
// Handles create, read, update, delete operations for workouts
// Includes search functionality as the additional feature

const express = require('express');
const Workout = require('../models/Workout');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Public read-only listing of workouts (no authentication required)
router.get('/public', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    let workouts;
    
    if (searchQuery) {
      // Search functionality - additional feature
      workouts = await Workout.find({
        $text: { $search: searchQuery }
      }).populate('createdBy', 'username').sort({ date: -1 });
    } else {
      workouts = await Workout.find().populate('createdBy', 'username').sort({ date: -1 });
    }
    
    res.render('workouts/public', {
      title: 'Public Workouts - Workout Tracker',
      workouts,
      searchQuery,
      isAuthenticated: req.isAuthenticated()
    });
  } catch (error) {
    console.error('Error fetching public workouts:', error);
    res.status(500).render('error', { 
      message: 'Error loading workouts',
      error: error 
    });
  }
});

// Dashboard - authenticated users only
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    let workouts;
    
    if (searchQuery) {
      // Search functionality for authenticated users
      workouts = await Workout.find({
        createdBy: req.user._id,
        $text: { $search: searchQuery }
      }).sort({ date: -1 });
    } else {
      workouts = await Workout.find({ createdBy: req.user._id }).sort({ date: -1 });
    }
    
    res.render('workouts/index', {
      title: 'My Workouts - Workout Tracker',
      workouts,
      searchQuery,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).render('error', { 
      message: 'Error loading workouts',
      error: error 
    });
  }
});

// Create workout form
router.get('/new', isAuthenticated, (req, res) => {
  res.render('workouts/new', {
    title: 'Add New Workout - Workout Tracker',
    workout: {},
    error: req.flash('error')
  });
});

// Create workout POST
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, type, duration, intensity, date, calories, notes } = req.body;
    
    // Validation
    if (!title || !type || !duration) {
      req.flash('error', 'Title, type, and duration are required');
      return res.redirect('/workouts/new');
    }
    
    const workout = new Workout({
      title,
      description,
      type,
      duration: parseInt(duration),
      intensity,
      date: date || new Date(),
      calories: calories ? parseInt(calories) : undefined,
      notes,
      createdBy: req.user._id
    });
    
    await workout.save();
    req.flash('success', 'Workout added successfully!');
    res.redirect('/workouts');
    
  } catch (error) {
    console.error('Error creating workout:', error);
    req.flash('error', 'Error creating workout. Please try again.');
    res.redirect('/workouts/new');
  }
});

// Show workout details
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!workout) {
      return res.status(404).render('error', { 
        message: 'Workout not found',
        error: { status: 404 } 
      });
    }
    
    res.render('workouts/show', {
      title: `${workout.title} - Workout Tracker`,
      workout
    });
    
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).render('error', { 
      message: 'Error loading workout',
      error: error 
    });
  }
});

// Edit workout form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!workout) {
      return res.status(404).render('error', { 
        message: 'Workout not found',
        error: { status: 404 } 
      });
    }
    
    res.render('workouts/edit', {
      title: `Edit ${workout.title} - Workout Tracker`,
      workout,
      error: req.flash('error')
    });
    
  } catch (error) {
    console.error('Error fetching workout for edit:', error);
    res.status(500).render('error', { 
      message: 'Error loading workout',
      error: error 
    });
  }
});

// Update workout
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, description, type, duration, intensity, date, calories, notes } = req.body;
    
    // Validation
    if (!title || !type || !duration) {
      req.flash('error', 'Title, type, and duration are required');
      return res.redirect(`/workouts/${req.params.id}/edit`);
    }
    
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      {
        title,
        description,
        type,
        duration: parseInt(duration),
        intensity,
        date: date || new Date(),
        calories: calories ? parseInt(calories) : undefined,
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).render('error', { 
        message: 'Workout not found',
        error: { status: 404 } 
      });
    }
    
    req.flash('success', 'Workout updated successfully!');
    res.redirect('/workouts');
    
  } catch (error) {
    console.error('Error updating workout:', error);
    req.flash('error', 'Error updating workout. Please try again.');
    res.redirect(`/workouts/${req.params.id}/edit`);
  }
});

// Delete confirmation page
router.get('/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!workout) {
      return res.status(404).render('error', { 
        message: 'Workout not found',
        error: { status: 404 } 
      });
    }
    
    res.render('workouts/delete', {
      title: `Delete ${workout.title} - Workout Tracker`,
      workout
    });
    
  } catch (error) {
    console.error('Error fetching workout for deletion:', error);
    res.status(500).render('error', { 
      message: 'Error loading workout',
      error: error 
    });
  }
});

// Delete workout
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!workout) {
      return res.status(404).render('error', { 
        message: 'Workout not found',
        error: { status: 404 } 
      });
    }
    
    req.flash('success', 'Workout deleted successfully!');
    res.redirect('/workouts');
    
  } catch (error) {
    console.error('Error deleting workout:', error);
    req.flash('error', 'Error deleting workout. Please try again.');
    res.redirect('/workouts');
  }
});

module.exports = router;

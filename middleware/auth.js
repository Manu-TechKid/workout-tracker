// Authentication middleware
// Protects routes that require user authentication

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/workouts');
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};

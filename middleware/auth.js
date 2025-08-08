// Authentication middleware
// Protects routes that require user authentication

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};

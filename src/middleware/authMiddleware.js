const jwt = require('jsonwebtoken');

// Middleware to ensure the user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = userPayload;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to authorize admin users
exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
};
const jwt = require('jsonwebtoken');

exports.ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = userPayload;
            next();
        });
    } else if (req.isAuthenticated()) {
        req.user = req.user || req.session.passport.user;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }
};

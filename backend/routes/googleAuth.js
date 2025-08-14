const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Step 1: Start Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login?error=auth_failed' }),
  (req, res) => {
    try {
      // Check if JWT_SECRET is defined
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.redirect('http://localhost:3000/login?error=config_error');
      }

      // Generate JWT token for the user
      const payload = {
        user: {
          id: req.user.id,
          email: req.user.emails[0].value,
          name: req.user.displayName
        }
      };

      const authtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      // Redirect with token as query parameter
      res.redirect(`http://localhost:3000/?login=success&token=${authtoken}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect('http://localhost:3000/login?error=server_error');
    }
  }
);

module.exports = router;
import express from 'express';
import passport from 'passport';
import config from '../../../config.js';
const router = express.Router();
import User from '../../models/User';

// Facebook authentication
router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: config.facebookFail }),
  (req, res) => {
    console.log('Facebook callback req.user', req.user);
    // res.json({ token: req.user.access_token });
    res.redirect(config.facebookSuccess+"?access_token=" + req.user.access_token);
  }
);

// Check for user info
router.get('/', passport.authenticate('bearer', { session: false }),
  (req, res) => {
    console.log("ENTERING USER CHECK");
    res.send("LOGGED IN as " + req.user.facebookId + " - <a href=\"/logout\">Log out</a>");
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(config.logout);
});

module.exports = router;

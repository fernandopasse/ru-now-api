// config
import config from '../config';
// Set SSL
import createServer from 'auto-sni';

// Express app & Socket io
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8001;
// Passport auth
import passport from 'passport';
const FacebookStrategy = require('passport-facebook').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

// MongoDB
import mongoose from 'mongoose';
mongoose.connect(`mongodb://${config.mongodb}`);
const User = mongoose.model('User', {name: String, username: String, access_token: String, provider: String, facebook: {name: String, id: String}});

// Express config
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new BearerStrategy((token, done) => {
  User.findOne({ access_token: token }, (err, user) => {
    if(err) {
      return done(err)
    }
    if(!user) {
      return done(null, false)
    }
    return done(null, user, { scope: 'all' })
  });
}));

passport.use(new FacebookStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.facebookCallback
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ 'facebook.id': profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      //No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
        user = new User({
          name: profile.displayName,
          username: profile.username,
          provider: 'facebook',
          access_token: accessToken,
          //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
          facebook: profile._json
        });
        user.save((err) => {
          console.log("ERROR FACEBOOK SAVE");
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        //found user. Return
        console.log("USER IS LOGGED: ", user);
        return done(err, user);
      }
        });
  }
));
// Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: config.facebookFail }),
  (req, res) => {
    console.log('Facebook callback req.user', req.user);
    // res.json({ token: req.user.access_token });
    res.redirect(config.facebookSuccess+"?access_token=" + req.user.access_token);
  }
);

// Check for user info
app.get('/user', passport.authenticate('bearer', { session: false }),
  (req, res) => {
    console.log("ENTERING USER CHECK");
    res.send("LOGGED IN as " + req.user.facebookId + " - <a href=\"/logout\">Log out</a>");
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect(config.logout);
});

// Socket IO
io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});
// SSL
// createServer({
//   email: 'luandro@gmail.com',
//   agreeTos: true,
//   domains: ["localhost"],
//   ports: {
//     http: 8002,
//     https: 8003
//   }
// }, app);
// Start listening on port
app.listen(port, () => {
  console.log('Ouvindo na porta: ', port);
})

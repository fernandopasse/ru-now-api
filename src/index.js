// Express app & Socket io
import express from 'express';
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
// MongoDB
import mongoose from 'mongoose';
mongoose.connect('mongodb://ufvjs:vicosa2016@ds013202.mlab.com:13202/runow');
const User = mongoose.model('User', {name: String, email: String, username: String, provider: String, facebook: {name: String, id: String}});

// Express config
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);
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

passport.use(new FacebookStrategy({
    clientID: '521375034735921',
    clientSecret: '4bc315eba8c63a2f91f36c7192b337b4',
    callbackURL: "http://localhost:8001/auth/facebook/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({
      'facebook.id': profile.id
    }, (err, user) => {
      if (err) {
          return done(err);
      }
    //No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
          user = new User({
              name: profile.displayName,
              // email: profile.emails[0].value,
              username: profile.username,
              provider: 'facebook',
              //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
              facebook: profile._json
          });
          user.save((err) => {
            console.log("ERROR FACEBOOK LOGIN");
            if (err) console.log(err);
            return done(err, user);
          });
      } else {
        //found user. Return
        if(err) {
          console.log("ERROR:", err);
        }
        console.log(user);
        return done(err, user);
      }
        });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
app.get('/', (req, res) => {
  res.send('SUCESSSSOOOOO')
})
io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});

app.listen(port, () => {
  console.log('Ouvindo na porta: ', port);
})

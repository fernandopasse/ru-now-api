import User from './models/User';
import config from '../config';

module.exports = (passport, FacebookStrategy, BearerStrategy) => {

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
}

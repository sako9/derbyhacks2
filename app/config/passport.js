var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
      // Return if user not found in database
        if(!user){
            return done(null, false, {
                message: "Credentials are incorrect"
            });
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if(!isMatch){
                return done(null, false, {
                    message: "Credentials are incorrect"
                });
            }
        });

      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
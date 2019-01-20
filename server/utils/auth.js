var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require("../models/User.js");

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      where: {
        username: username
      }
    }).then(user => {
      console.log(user);
      return user.validPassword(password) ? done(null, user) : done(null, false, {
        message: "Incorrect password"
      });
    }).catch(err => {
      console.log(err);
      return done(null, false, {
        message: 'Incorrect username.'
      });
    });
  }
));

module.exports = passport;
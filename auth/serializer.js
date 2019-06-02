let passport = require('passport');

// ======GET AND SET SESSIONS======
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})
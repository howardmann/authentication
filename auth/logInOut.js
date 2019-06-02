let logInOut = module.exports = {}

// Dependencies
let bcrypt = require('bcrypt');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../repositories/userRepository.js')

// ======USER LOGIN AUTHENTICATION STRATEGY=======
passport.use('local-login', new LocalStrategy({
    // Fields to accept
    usernameField: 'email', // default is username, override to accept email
    passwordField: 'password',
    passReqToCallback: true // allows us to access req in the call back
  }, async (req, email, password, done) => {
    // Check if user and password is valid
    let user = await User.findBy('email', email)
    let passwordValid = user && bcrypt.compareSync(password, user.passwordHash)

    // If password valid call done and serialize user.id to req.user property
    if (passwordValid) {
      return done(null, {
        id: user.id
      })
    }
    // If invalid call done with false and flash message
    return done(null, false);
}))


// GET route to render login form view
logInOut.loginPage = (req, res, next) => {
  res.render('auth/login')
}

// POST route to handle req.body payload. Pass to passport login strategy with relevant redirects
logInOut.login = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: {
    type: 'messageFailure',
    message: 'Invalid email and/ or password.'
  },
  successFlash: {
    type: 'messageSuccess',
    message: 'Successfully logged in.'
  }
})

// GET logout route, flash message and redirect
logInOut.logout = (req, res, next) => {
  req.logout();
  req.flash('messageSuccess', 'Successfully logged out')
  res.redirect('/login')
}

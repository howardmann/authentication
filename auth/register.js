let register = module.exports = {}

// Dependecies
let bcrypt = require('bcrypt');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../repositories/userRepository.js')

// =======USER SIGN UP AND HASH PASSWORD STRATEGY========
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', // map username to custom field, we call it email in our form
    passwordField: 'password',
    passReqToCallback: true // lets you access other params in req.body
  },
  async (req, email, password, done) => {
    // Return false if user already exists - failureRedirect
    let user = await User.findBy('email', email)
    if (user) { return done(null, false) }

    // Create new user and return the user - successRedirect
    let newUser = await User.create({
      email,
      passwordHash: bcrypt.hashSync(password, 10), // hash the password early
      phone: req.body.phone
    })

    // save the user_id to the req.user property
    return done(null, {id: newUser.id})
  }
))

// GET route to render signup page
register.signupPage = (req, res, next) => {
  res.render('auth/signup')
}

// POST route to signup user and redirect 
register.signup = passport.authenticate('local-signup', {
  successRedirect: '/users/profile',
  failureRedirect: '/signup',
  failureFlash: {
    type: 'messageFailure',
    message: 'Email already taken.'
  },
  successFlash: {
    type: 'messageSuccess',
    message: 'Successfully signed up.'
  }
})

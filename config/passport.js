let bcrypt = require('bcrypt');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../model/user.js')


// =======USER SIGN UP AND HASH PASSWORD========
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', // map username to custom field, we call it email in our form
    passwordField: 'password',
    passReqToCallback: true // lets you access other params in req.body
  },
  (req, email, password, done) => {
    // Return false if user already exists - failureRedirect
    let user = User.findBy('email', email)
    if (user) { return done(null, false) }

    // Create new user and return the user - successRedirect
    let newUser = User.create({
      email,
      password: bcrypt.hashSync(password, 10),
      phone: req.body.phone
    })
    
    // save the user_id to the req.user property
    return done(null, {id: newUser.id})
  }
))

// ======USER LOGIN AUTHENTICATION=======
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  // Check if user and password is valid
  let user = User.findBy('email', email)
  let passwordValid = user && User.comparePassword(password, user.password)  
  if (!passwordValid) { return done(null, false) }

  // If valid save the user_id to the req.user property
  return done(null, {id: user.id})
}))


// ======GET AND SET SESSIONS======
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})
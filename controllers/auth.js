let auth = module.exports = {}

// users model
let passport = require('passport')
require('../config/passport.js')

auth.loginPage = (req, res, next) => {
  res.render('auth/login')
}

auth.signupPage = (req, res, next) => {
  res.render('auth/signup')
}

// auth.login = (req, res, next) => {
//   console.log(req.body);
//   res.send(req.body)
// }

auth.login = passport.authenticate('local-login', {
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

// auth.signup = (req, res, next) => {
//   let {email, password, phone} = req.body
//   User.create({email, password, phone})
//   res.redirect('/users')
// }

auth.signup = passport.authenticate('local-signup', {
  successRedirect: '/users',
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

auth.logout = (req, res, next) => {
  req.logout();
  req.flash('messageSuccess', 'Successfully logged out')
  res.redirect('/login')
}
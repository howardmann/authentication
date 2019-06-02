let auth = module.exports = {}

// users model
let passport = require('passport')
require('../config/passport.js')

auth.loginPage = (req, res, next) => {
  res.render('auth/login')
}

auth.signupPage = (req, res, next) => {
  res.render('auth/signup', {
    message: req.flash('message')
  })
}

// auth.login = (req, res, next) => {
//   console.log(req.body);
//   res.send(req.body)
// }

auth.login = passport.authenticate('local-login', {
  successRedirect: '/',
  failuredRedirect: '/login',
  failureFlash: {
    type: 'message',
    message: 'Email or Password incorrect'
  },
  successFlash: {
    type: 'message',
    message: 'Successful login'
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
    type: 'message',
    message: 'Email already taken.'
  },
  successFlash: {
    type: 'message',
    message: 'Successfully signed up.'
  }
})
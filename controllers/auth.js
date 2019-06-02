let auth = module.exports = {}

// users model
let User = require('../model/user')

let passport = require('passport')
require('../auth/passport.js')

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

auth.logout = (req, res, next) => {
  req.logout();
  req.flash('messageSuccess', 'Successfully logged out')
  res.redirect('/login')
}

// ===AUTHORIZATION MDDLEWARE
auth.loginRequired = (req, res, next) => {
  let isAuthenticated = req.isAuthenticated()
  if (!isAuthenticated) {
    req.flash('messageFailure', 'Must be logged in')
    return res.redirect('/login')
  }
  next()
}

auth.adminRequired = (req, res, next) => {
  let isAuthenticated = req.isAuthenticated()
  let id = req.user && req.user.id
  let user = User.findBy('id', id)
  let isAdmin = user && user.admin

  if(!isAuthenticated) {
    req.flash('messageFailure', 'Must be logged in')
    return res.redirect('/login')
  }

  if (!isAdmin) {
    req.flash('messageFailure', 'Admin only')
    return res.redirect('/users/profile')
  }

  next();
}
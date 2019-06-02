let auth = module.exports = {}

// users model
let User = require('../model/user')

auth.loginPage = (req, res, next) => {
  res.render('auth/login')
}

auth.signupPage = (req, res, next) => {
  res.render('auth/signup')
}

auth.login = (req, res, next) => {
  console.log(req.body);
  res.send(req.body)
}

auth.signup = (req, res, next) => {
  let {email, password, phone} = req.body
  User.create({email, password, phone})
  res.redirect('/users')
}


let auth = module.exports = {}

// Dependecies
require('./serializer')
let {loginPage, login, logout} = require('./logInOut.js')
let {signupPage, signup} = require('./register.js')
let {loginRequired, adminRequired, signupRequired} = require('./authorization.js')

// login logout
auth.loginPage = loginPage
auth.login = login
auth.logout = logout

// signup
auth.signupPage = signupPage
auth.signup = signup

//authorization
auth.loginRequired = loginRequired
auth.adminRequired = adminRequired
auth.signupRequired = signupRequired
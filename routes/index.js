const express = require('express')
let router = express.Router()

// === AUTH ENDPOINTS ===
const auth = require('../auth')
router
  .get('/login', auth.loginPage)
  .post('/login', auth.login)
  .get('/signup', auth.signupPage)
  .post('/signup', auth.signup)
  .get('/logout', auth.logout)

// === BOILERPLATE === 
// pages endpoints
let pages = require('./pages')

router
  .get('/', pages.home)
  .get('/admin', auth.loginRequired, auth.adminRequired, pages.admin)
  .get('/special', auth.signupRequired, pages.special)
  
// users endpoints
let users = require('./users')
router
  .get('/users/profile', auth.loginRequired, users.show)
  // .get('/users', auth.loginRequired, auth.adminRequired, users.index)
  .get('/users', users.index)

module.exports = router
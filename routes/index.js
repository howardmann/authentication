const express = require('express')
let router = express.Router()

// auth endpoints
let auth = require('../auth')
router
  .get('/login', auth.loginPage)
  .post('/login', auth.login)
  .get('/signup', auth.signupPage)
  .post('/signup', auth.signup)
  .get('/logout', auth.logout)

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
  .get('/users', auth.adminRequired, users.index)
  .post('/users', auth.adminRequired, users.create)

module.exports = router
const express = require('express')
let router = express.Router()

// auth endpoints
let auth = require('../controllers/auth')
router
  .get('/login', auth.loginPage)
  .post('/login', auth.login)
  .get('/signup', auth.signupPage)
  .post('/signup', auth.signup)
  .get('/logout', auth.logout)

// pages endpoints
let pages = require('../controllers/pages')

router
  .get('/', pages.home)
  .get('/admin', auth.adminRequired, pages.admin)
  

// users endpoints
let users = require('../controllers/users')
router
  .get('/users/profile', auth.loginRequired, users.show)
  .get('/users', auth.adminRequired, users.index)
  .post('/users', users.create)



module.exports = router
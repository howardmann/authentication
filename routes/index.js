const express = require('express')
let router = express.Router()


// auth endpoints
let auth = require('../controllers/auth')
router
  .get('/login', auth.loginPage)
  .post('/login', auth.login)
  .get('/signup', auth.signupPage)
  .post('/signup', auth.signup)

// pages endpoints
let pages = require('../controllers/pages')

router
  .get('/', pages.home)
  .get('/admin', pages.admin)
  

// users endpoints
let users = require('../controllers/users')
router
  .get('/users/profile', users.show)
  .get('/users', users.index)
  .post('/users', users.create)




module.exports = router

// // public
// router.get('/', (req, res, next) => {
//     res.render('index')
//   })

// // private secret
// router.get('/secret', (req, res, next) => {
//   res.render('secret')
// })

// // private profile
// const users = [
//   {id: 1, email: 'howie@email.com', passwordHash: 'xyz', mobile: '12345'},
//   {id: 2, email: 'hela@email.com', passwordHash: 'xyz', mobile: '12345'},
//   {id: 3, email: 'felix@email.com', passwordHash: 'asdsad2', mobile: '12345'},
// ]

// router.get('/profile', async (req, res, next) => {  
//   // TODO: Pull user_id from session
//   let id = Number(req.params.id) || 1
//   let user = await users.find((user) => user.id === id)
//   res.render('profile', {user})
// })

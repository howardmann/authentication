let users = module.exports = {}

let User = require('../model/user')

users.index = (req, res, next) => {
  let users = User.find()
  res.send(users)
}

users.show = (req, res, next) => { 
  let id = req.user && req.user.id
  let user = User.findBy('id', id)
  res.render('users/profile',{
    userProfile: user
  })
}

users.create = (req, res, next) => {
  let {email, password, mobile} = req.body
  let newUser = User.create({email, password, mobile})
  res.send(newUser)
}
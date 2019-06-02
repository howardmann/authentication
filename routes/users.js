let users = module.exports = {}

let User = require('../repositories/userRepository')

users.index = (req, res, next) => {
  User.find().then(users => {
    res.send(users)
  })
  
}

users.show = (req, res, next) => { 
  let id = req.user && req.user.id
  User.findBy('id', id).then(user => {
    res.render('users/profile', {
      userProfile: user
    })
  })
}


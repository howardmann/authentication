let User = module.exports = {}

let bcrypt = require('bcrypt')
let USERS = require('../db/users')

User.create = (payload) => {
  let {email, passwordHash, phone, admin} = payload
  let newUser = {
    id: USERS.length + 1,
    email,
    passwordHash, // only accept and write password as a hash
    phone,
    admin: admin || false
  }
  USERS.push(newUser)
  return User.findBy('id', newUser.id)
}

User.find = () => {
  return USERS
}

User.findBy = (prop, val) => {
  let user = USERS.find(user => user[prop] == val)
  return user
}

User.comparePassword = (password, userHash) => {
  return bcrypt.compareSync(password, userHash)
}
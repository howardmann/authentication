let User = module.exports = {}

let bcrypt = require('bcrypt')
let USERS = require('../db/users')

User.create = (payload) => {
  let {email, password, mobile, admin} = payload
  let newUser = {
    id: USERS.length + 1,
    email,
    password: bcrypt.hashSync(password, 10),
    mobile,
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
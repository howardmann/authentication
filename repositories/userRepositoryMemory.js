let User = module.exports = {}

let USERS = require('../db/usersMemory')

let findUsers = () => {
  return USERS
}

let findUserBy = (prop, val) => {
  let user = USERS.find(user => user[prop] == val)
  return user
}

let createUser = (payload) => {
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

module.exports = {
  findUsers,
  findUserBy,
  createUser
}
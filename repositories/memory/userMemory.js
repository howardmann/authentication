let USERS = require('../../db/usersMemory')

let findUsers = () => {
  return Promise.resolve(USERS)
}

let findUserBy = (prop, val) => {
  let user = USERS.find(user => user[prop] == val)
  return Promise.resolve(user)
}

let createUser = async (payload) => {
  let {email, passwordHash, phone, admin} = payload
  let newUser = {
    id: USERS.length + 1,
    email,
    passwordHash, // only accept and write password as a hash
    phone,
    admin: admin || false
  }
  USERS.push(newUser)
  let user = await findUserBy('id', newUser.id)
  return Promise.resolve(user)
}

module.exports = {
  findUsers,
  findUserBy,
  createUser
}
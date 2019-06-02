let User = require('../../model/mongodb/user.js')
let serialize = require('./serializer')

let findUsers = () => {
  return User.find({})
    .then(resp => {
      return serialize(resp)
    })
}

let findUserBy = (prop, val) => {
  // mongodb id is saved as _id
  if (prop === 'id') { prop = '_id'}
  return User.find({[prop]: val})
    .then(resp => {
      return serialize(resp[0])
    })
}

let createUser = async (payload) => {
  let {
    email,
    passwordHash,
    phone,
    admin
  } = payload
  return User.create({email, passwordHash,phone, admin})
    .then(resp => {
      return serialize(resp)
    })
}

module.exports = {
  findUsers,
  findUserBy,
  createUser
}



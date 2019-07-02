// let {
//   findUsers, 
//   findUserBy, 
//   createUser
// } = require('./mongodb/userMongoDB.js')

let {
  findUsers,
  findUserBy,
  createUser
} = require('./pg/userPG')

const UserRepository = {
  find: findUsers,
  findBy: (prop, val) => findUserBy(prop, val),
  create: (payload) => createUser(payload)
}

module.exports = UserRepository
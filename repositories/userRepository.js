let {
  findUsers, 
  findUserBy, 
  createUser
} = require('./mongodb/userMongoDB.js')

const UserRepository = {
  find: findUsers,
  findBy: (prop, val) => findUserBy(prop, val),
  create: (payload) => createUser(payload)
}

module.exports = UserRepository
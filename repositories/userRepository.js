let {findUsers, findUserBy, createUser} = require('./userRepositoryMemory.js')

const UserRepository = {
  find: findUsers,
  findBy: (prop, val) => findUserBy(prop, val),
  create: (payload) => createUser(payload)
}

module.exports = UserRepository
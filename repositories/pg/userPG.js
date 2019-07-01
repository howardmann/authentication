let User = require('../../model/pg/user.js')
let serialize = require('./serializer')

let findUsers = () => {
  return User.find()
    .then(resp => {
      return serialize(resp)
    })
}

module.exports = {
  findUsers
}

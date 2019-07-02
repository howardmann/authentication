let knex = require('../../db/pg/knex')

let serialize = require('./serializer')

let findUsers = () => {
  return knex.raw(`SELECT * FROM users;`)
    .then(data => data.rows)
    .then(serialize)
}

let findUserBy = (prop, val) => {
  return knex.raw(`
    SELECT * FROM users WHERE ${prop}= '${val}'
  `)
  .then(data => data.rows[0])
  .then(serialize)
}

let createUser = async (payload) => {
  let {
    email,
    passwordHash,
    phone,
    admin
  } = payload
  return knex('users')
    .insert({
      email,
      password_hash: passwordHash,
      phone,
      admin
    })
    .returning('*')
    .then(result => result[0])
    .then(serialize)
}

module.exports = {
  findUsers,
  findUserBy,
  createUser
}


// let createUser = async (payload) => {
//   let {
//     email,
//     passwordHash,
//     phone,
//     admin
//   } = payload
//   return User.create({
//       email,
//       passwordHash,
//       phone,
//       admin
//     })
//     .then(resp => {
//       return serialize(resp)
//     })
// }

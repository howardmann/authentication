let knex = require('../../db/pg/knex')

let User = module.exports = {}

User.find = () => {
  return knex.raw(`SELECT * FROM users;`)
  .then(data => data.rows)
}


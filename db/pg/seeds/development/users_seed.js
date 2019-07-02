let bcrypt = require('bcrypt')

exports.seed = async function(knex, Promise) {
  await knex.raw('DELETE FROM Users')

  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1')
  
  let howiePassword = bcrypt.hashSync('chicken',10) 
  let helaPassword = bcrypt.hashSync('chicken',10) 
  let felixPassword = bcrypt.hashSync('chicken',10) 
  
  await knex.raw(`
    INSERT INTO Users (email, password_hash, phone, admin) VALUES
    ('howie@email.com', '${howiePassword}', '142', TRUE),
    ('helabadga@gmail.com', '${helaPassword}', '1213', FALSE),
    ('felix@email.com', '${felixPassword}', '1423232', FALSE)
  `)
};


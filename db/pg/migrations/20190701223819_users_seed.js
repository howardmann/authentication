
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE Users (
      id serial PRIMARY KEY,
      email varchar(100),
      password_hash varchar(255),
      phone varchar(100),
      admin boolean DEFAULT false
    );
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`
    DROP TABLE Users;
  `)
};

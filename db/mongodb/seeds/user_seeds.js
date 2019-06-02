let mongoose = require('mongoose')
let User = require('../../../model/mongodb/user.js')
let bcrypt = require('bcrypt')

// Seeder using async await
let seedDatabase = async function () {
  let howie = {
    email: 'howie@email.com',
    passwordHash: bcrypt.hashSync('chicken',10),
    phone: '142',
    admin: true
  }
  
  let felix = {
    email: 'felix@email.com',
    passwordHash: bcrypt.hashSync('chicken', 10),
    phone: '1423232'
  }

  let hela = {
    email: 'helabadga@email.com',
    passwordHash: bcrypt.hashSync('chicken', 10),
    phone: '1213'
  }

  await User.create(howie)
  await User.create(felix)
  await User.create(hela)
};

// Drop DB then seed
mongoose.connection.collections.users.drop(async function () {
  await seedDatabase()
  mongoose.connection.close()
});

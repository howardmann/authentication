let mongoose = require('../../db/mongodb/connection.js')

let Schema = mongoose.Schema
let UserSchema = new Schema({
  email: String,
  passwordHash: String,
  phone: String,
  admin: {type: Boolean, default: false}
})

let User = mongoose.model('User', UserSchema)

module.exports = User
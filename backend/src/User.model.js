const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

SALT_ROUNDS = 12

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true 
  }
})

// mongoose pre-hook to bcrypt plaintext password
UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User

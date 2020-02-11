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

// mongoose pre-hook to hash plaintext password
UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
  next()
})

// method to validate plaintext password
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User

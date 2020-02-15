const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
  },
  isUpeMember: {
    type: Boolean,
    required: true,
    default: false
  },
  isProfessor: {
    type: Boolean,
    required: true,
    default: false
  },
  testbankCredits: {
    type: Number,
    required: true,
    default: 3
  },
  testbankUploadedTests: {
    type: Array,
    required: true
  },
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

UserSchema.statics.getProfile = async function(token) {
  payload = jwt.decode(token)
  return await this.findOne({ _id: payload._id }, 'email isUpeMember isProfessor testbankCredits testbankUploadedTests')
}

const User = mongoose.model('User', UserSchema)

module.exports = User

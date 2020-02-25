const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

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
  emailVerification: {
    isVerified: {
      type: Boolean,
      required: true,
      default: false
    },
    verificationString: {
      type: String,
      required: false
    }
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
  this.emailVerification.verificationString = crypto.randomBytes(32).toString('hex')
  next()
})

// method to validate plaintext password
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.isVerified = function() {
  return this.emailVerification.isVerified
}

UserSchema.statics.getProfile = async function(id) {
  return await this.findOne({ _id: id }, 'email isUpeMember isProfessor testbankCredits testbankUploadedTests')
}

UserSchema.statics.verifyEmail = async function(verificationString) {
  const user = await this.findOneAndUpdate(
    { 
      'emailVerification.isVerified': false,
      'emailVerification.verificationString': verificationString,
    }, 
    { 'emailVerification.isVerified': true })
  if (user) return true
  else return false
}

const User = mongoose.model('User', UserSchema)

module.exports = User

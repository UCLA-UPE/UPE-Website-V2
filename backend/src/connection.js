// connection.js
const mongoose = require('mongoose')
const User = require('./User.model')

const host = process.env.PRODUCTION ? 'mongo' : 'localhost'
const connection = 'mongodb://' + host + ':27017/upe-web'

// opt in to new MongoDB features
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const connectDb = () => {
  return mongoose.connect(connection)
}

module.exports = connectDb

// connection.js
const mongoose = require('mongoose')
const User = require('./User.model')

const host = (process.env.PRODUCTION === 'false') ? 
  'localhost' :  // dev
  'mongo'        // prod
const connection = 'mongodb://' + host + ':27017/upe-web'
console.log('API server connecting to ' + connection)

// opt in to new MongoDB features
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const connectDb = () => {
  return mongoose.connect(connection)
}

module.exports = connectDb

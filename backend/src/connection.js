// connection.js
const mongoose = require('mongoose')
const User = require('./User.model')

const host = process.env.PRODUCTION ? 'mongo' : 'localhost'
const connection = 'mongodb://' + host + ':27017/upe-web'

const connectDb = () => {
  return mongoose.connect(connection)
};

module.exports = connectDb

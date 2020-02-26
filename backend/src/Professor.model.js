const mongoose = require('mongoose')

const ProfessorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
    unique: true, // assume there are no name collisions
    index: true
  },
  department: String
})

const Professor = mongoose.model('Professor', ProfessorSchema)

module.exports = Professor

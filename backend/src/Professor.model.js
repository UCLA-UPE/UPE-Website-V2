const mongoose = require('mongoose')

const TestFilterSchema = new mongoose.Schema({
  // if ({test.value} {comparator} {value}) then { visibility = false }
  test_id: {
    comparator: String, //  '==', '*'
    value: String
  },
  course: {
    comparator: String, //  '==', '*'
    value: String
  },
  kind: {
    comparator: String, //  '==', '*'
    value: String
  },
  term: {
    comparator: String, //  '<=', '==', '>=', '*'
    value: String
  }
})

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
  department: String,
  testFilters: [TestFilterSchema]
})

const Professor = mongoose.model('Professor', ProfessorSchema)

module.exports = Professor

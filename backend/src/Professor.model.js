const mongoose = require('mongoose')

const VisibilityFilterSchema = new mongoose.Schema({
  // if ({test.value} {comparator} {value}) then { visibility = false }
  test_id: {
    comparator: String, //  '==', '*'
    value: String
  },
  course: {
    comparator: String, //  '==', '*'
    value: {
      subject: String, // MATH
      number: String,  // 32A
    }
  },
  kind: {
    comparator: String, //  '==', '*'
    value: {
      name: String,   // Midterm
      number: Number, // 2
    }
  },
  term: {
    comparator: String, //  '<=', '==', '>=', '*'
    value: {
      year: Number,    // 2019
      quarter: String, // Fall
    }
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
  visibilityFilters: [VisibilityFilterSchema]
})

const VisibilityFilter = mongoose.model('VisibilityFilter', VisibilityFilterSchema)
const Professor = mongoose.model('Professor', ProfessorSchema)

module.exports = { VisibilityFilter, Professor }

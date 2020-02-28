const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  course: {
    subject: {
      type: String,
      required: true,
      index: true
    },
    number: {
      type: String,
      required: true,
      index: true
    }
  },
  kind: {
    name: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: false
    }
  },
  term: {
    year: {
      type: Number,
      required: true
    },
    quarter: {
      type: String,
      required: true
    }
  },
  professor: { // later on, might need a unique identifier for professor name collisions
    name: {
      type: String,
      required: true
    }
  },
  test_file: {
    type: String,
    required: true
  },
  upload_time: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    required: true
  },
  visible: {
    type: Boolean,
    required: true,
    default: true
  }
})

const PUBLIC_FIELDS = '_id term.quarter term.year professor.name course.subject course.number kind.name kind.number'

TestSchema.methods.toString = function() {
  return `[${this.term.quarter} ${this.term.year}] (${this.professor.name}) ${this.course.subject} ${this.course.number} - ${this.kind.name} ${this.kind.number}`
}

TestSchema.statics.getSubjects = async function() {
  const uniqueSubjects = await this.distinct('course.subject')
  let ret = []
  for (subject of uniqueSubjects) {
    ret.push({
      'course_subject': subject,
      'course_numbers': await this.find({ 'course.subject': subject }).distinct('course.number'),
      'count': await this.find({ 'course.subject': subject }).countDocuments()
    })
  }
  ret.sort((a, b) => b['count'] - a['count'])
  return ret
}

TestSchema.statics.getSubjectNumbers = async function(subject) {
  const thisSubject = this.find({ 'course.subject': subject })
  const uniqueNumbers = await thisSubject.distinct('course.number')
  let ret = []
  for (number of uniqueNumbers) {
    ret.push({
      'course_number': number,
      'count': await thisSubject.find({ 'course.number': number }).countDocuments()
    })
  }
  ret.sort((a, b) => b['count'] - a['count'])
  return ret
}

TestSchema.statics.getTests = async function(filters, ignoreHiddenIf, sort, order, skip, limit) {

  console.log(filters)
  console.log(ignoreHiddenIf)

  const testsAgg = await this.aggregate([
    { 
      '$match': {
        '$and': [
          ...Object.entries(filters).map(([filterKey, filterItems]) => (
            { [filterKey]: { '$in': filterItems } }
          )),
          { '$or': [
            { visible: true },
            ...Object.entries(ignoreHiddenIf).map(([filterKey, filterItems]) => (
              { [filterKey]: { '$in': filterItems } }
            ))
          ]}
        ]
      }
    },
    { '$facet': {
      data: [
        { '$skip': skip },
        { '$limit': limit },
      ],
      count: [
        { '$count': 'count' }
      ]
    }}
  ])


  const tests = testsAgg[0]
  return [tests.data, tests.count[0] ? tests.count[0].count : 0]
}

TestSchema.statics.getFilterOptions = async function(preFilters) {

  console.log(preFilters)

  const filtersAgg = await this.aggregate([
    { '$match': preFilters},
    { '$facet': {
      courses: [
        { '$group': { _id: '$course' }},
        { '$project': { _id: 0, subject: '$_id.subject', number: '$_id.number' }}
      ],
      kinds: [
        { '$group': { _id: '$kind' }},
        { '$project': { _id: 0, name: '$_id.name', number: '$_id.number' }}
      ],
      terms: [
        { '$group': { _id: '$term' }},
        { '$project': { _id: 0, year: '$_id.year', quarter: '$_id.quarter'}}
      ],
      professors: [
        { '$group': { _id: '$professor.name' }},
        { '$project': { _id: 0, name: '$_id' }}
      ],
    }}
  ])
  let filterOptions = filtersAgg[0]
  for (const [key, val] of Object.entries(preFilters)) {
    console.log('deleting key ' + key + 's')
    delete filterOptions[key + 's']
  }
  return filterOptions
}

const Test = mongoose.model('Test', TestSchema)

module.exports = Test

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
      index: true,
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

const termQuarterCompare = (a, b) => {
  if (a.quarter === b.quarter) return 0
  else if (a.quarter === 'Fall') return -1
  else if (b.quarter === 'Fall') return 1
  else if (a.quarter === 'Winter') return -1
  else if (b.quarter === 'Winter') return 1
  else if (a.quarter === 'Spring') return -1
  else if (b.quarter === 'Spring') return 1
  else if (a.quarter === 'Summer') return -1
  else if (b.quarter === 'Summer') return 1
  else return a.quarter.localeCompare(b.quarter)
}

const termCompare = (a, b) => {
  if (a.year !== b.year) return a.year - b.year
  else return termQuarterCompare(a, b)
}

const kindCompare = (a, b) => {
  if (a.name === b.name) { return a.number - b.number }
  else if (a.name === 'Quiz') { return -1 }
  else if (b.name === 'Quiz') { return 1 }
  else if (a.name === 'Midterm') { return -1 }
  else if (b.name === 'Midterm') { return 1 }
  else if (a.name === 'Final') { return -1 }
  else if (b.name === 'Final') { return 1  }
  else { return a.name.localeCompare(b.name) }
}

const objectEqualDepth1 = (a, b) => {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) {
    return false
  }
  for (let k of ak) {
    if (a[k] !== b[k]) {
      return false
    }
  }
  return true
}

const visibilityFilterMatch = (field, lval, comparator, rval) => {
  if (field === 'term') {
    if (comparator === '>=' && termCompare(lval, rval) >= 0 || 
        comparator === '<=' && termCompare(lval, rval) <= 0) {
      return true
    }
  }

  if (comparator === '*') {
    return true
  }
  else if (comparator === '==' && objectEqualDepth1(lval, rval)) {
    return true
  }
  return false
}

TestSchema.methods.toString = function() {
  return `[${this.term.quarter} ${this.term.year}] \
          (${this.professor.name}) \
          ${this.course.subject} ${this.course.number} - \
          ${this.kind.name} ${this.kind.number}`
}

TestSchema.methods.updateVisibility = function(testVisibilityFilters) {
  filterLoop:
  for (const filter of testVisibilityFilters.toObject()) {
    if (visibilityFilterMatch('test_id', this._id, filter.test_id.comparator, filter.test_id.value) &&
        visibilityFilterMatch('course', this.course.toObject(), filter.course.comparator, filter.course.value) &&
        visibilityFilterMatch('kind', this.kind.toObject(), filter.kind.comparator, filter.kind.value) &&
        visibilityFilterMatch('term', this.term.toObject(), filter.term.comparator, filter.term.value)) {
      this.visible = false
      this.save()
      return
    }
  }
  this.visible = true
  this.save()
}

TestSchema.statics.getSubjects = async function() {
  const uniqueSubjects = await this.find({ 'visible': true }).distinct('course.subject')
  let ret = []
  for (subject of uniqueSubjects) {
    ret.push({
      'course_subject': subject,
      'course_numbers': await this.find({ 'course.subject': subject, 'visible': true }).distinct('course.number'),
      'count': await this.find({ 'course.subject': subject, 'visible': true }).countDocuments()
    })
  }
  ret.sort((a, b) => b['count'] - a['count'])
  return ret
}

TestSchema.statics.getSubjectNumbers = async function(subject) {
  const thisSubject = this.find({ 'course.subject': subject, 'visible': true })
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

TestSchema.statics.getTests = async function(filters, 
                                             bypassHidden, 
                                             sort, order, skip, limit) {
  const testsAgg = await this.aggregate([
    { '$match': {
        '$and': [
          ...Object.entries(filters).map(([filterKey, filterItems]) => (
            { [filterKey]: { '$in': filterItems } }
          )),
          { '$or': [
            { visible: true },
            ...Object.entries(bypassHidden).map(([filterKey, filterItems]) => (
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

TestSchema.statics.getFilterOptions = async function(filters, bypassHidden) {
  const filtersAgg = await this.aggregate([
    { '$match': {
        '$and': [
          ...Object.entries(filters).map(([filterKey, filterItems]) => (
            { [filterKey]: { '$in': filterItems } }
          )),
          { '$or': [
            { visible: true },
            ...Object.entries(bypassHidden).map(([filterKey, filterItems]) => (
              { [filterKey]: { '$in': filterItems } }
            ))
          ]}
        ]
      }
    },
    { '$facet': {
      course: [
        { '$group': { _id: '$course' }},
        { '$project': { _id: 0, subject: '$_id.subject', number: '$_id.number' }}
      ],
      kind: [
        { '$group': { _id: '$kind' }},
        { '$project': { _id: 0, name: '$_id.name', number: '$_id.number' }}
      ],
      term: [
        { '$group': { _id: '$term' }},
        { '$project': { _id: 0, year: '$_id.year', quarter: '$_id.quarter'}}
      ],
      professor: [
        { '$group': { _id: '$professor.name' }},
        { '$project': { _id: 0, name: '$_id' }}
      ],
    }}
  ])
  let filterOptions = filtersAgg[0]
  // don't show options that are already filtered for
  for (const [filterKey, _] of Object.entries(filters)) {
    delete filterOptions[filterKey]
  }
  // sort
  if (filterOptions.professor) filterOptions.professor.sort((a, b) => (
    a.name === null ? -1 : b.name === null ? 1 : a.name.localeCompare(b.name)
  ))
  if (filterOptions.course) filterOptions.course.sort()
  if (filterOptions.kind) filterOptions.kind.sort(kindCompare)
  if (filterOptions.term) filterOptions.term.sort(termCompare)
  return filterOptions
}

const Test = mongoose.model('Test', TestSchema)

module.exports = Test

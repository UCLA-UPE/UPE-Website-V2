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
      required: true
    }
  },
  term: {
    quarter: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  professor: {
    email: {
      type: String,
      required: false
    },
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
      'count': await this.find({ 'course.subject': subject }).count()
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
      'count': await thisSubject.find({ 'course.number': number }).count()
    })
  }
  ret.sort((a, b) => b['count'] - a['count'])
  return ret
}

TestSchema.statics.getSubjectNumberTests = async function(subject, number) {
  const tests = await this.find({ 'course.subject': subject, 'course.number': number }, PUBLIC_FIELDS)
  return tests
}

TestSchema.statics.getTests = async function(course, filters, sort, order, skip, limit) {
  console.log(filters)
  const tests = await this.aggregate([
    { '$match': { 
      course: course, 
      ...(filters.professor && {'professor.name': { '$in': filters.professor.map(p => p.name) }}),
      ...(filters.kind && {kind: { '$in': filters.kind }}),
      ...(filters.term && {term: { '$in': filters.term }})
    }},
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
  return [tests[0].data, tests[0].count[0] ? tests[0].count[0].count : 0]
}

TestSchema.statics.getFilterOptions = async function(course) {

  // distinct on multiple fields: need to use flexibility of aggregate pipeline

  const uniqueProfessors = await this.aggregate().
    match({ course: course }).
    group({ _id: { name: "$professor.name" }}).
    project({ _id: 0, name: "$_id.name" })

  const uniqueKinds = await this.aggregate().
    match({ course: course }).
    group({ _id: { name: "$kind.name", number: "$kind.number" }}).
    project({ _id: 0, name: "$_id.name", number: "$_id.number" })

  const uniqueTerms = await this.aggregate().
    match({ course: course }).
    group({ _id: { year: "$term.year", quarter: "$term.quarter" }}).
    project({ _id: 0, year: "$_id.year", quarter: "$_id.quarter" })

  return { professors: uniqueProfessors, kinds: uniqueKinds, terms: uniqueTerms }
}

const Test = mongoose.model('Test', TestSchema)

module.exports = Test

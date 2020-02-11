const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  course: {
    subject: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
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

TestSchema.methods.toString = function() {
  return `[${this.term.quarter} ${this.term.year}] (${this.professor.name}) ${this.course.subject} ${this.course.number} - ${this.kind.name} ${this.kind.number}`
}

TestSchema.statics.getSubjectCounts = async function() {
  let subjects = await this.distinct('course.subject')
  let counts = []
  for (subject of subjects) {
    counts.push({
      'course_subject': subject,
      'course_numbers': await this.find({ 'course.subject': subject }).distinct('course.number'),
      'count': await this.find({ 'course.subject': subject }).count()
    })
  }
  counts.sort((a, b) => b['count'] - a['count'])
  return counts
}

const Test = mongoose.model('Test', TestSchema)

module.exports = Test

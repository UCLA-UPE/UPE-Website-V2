const express = require('express')
const bodyParser = require('body-parser')
const connectDb = require('./src/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')

// some magic constants
const PORT = 8080
const HOST = '0.0.0.0'
const TOKEN_EXPIRY_PERIOD = '30d'

// mongoose models
const User = require('./src/User.model')
const Test = require('./src/Test.model')



const app = express()

///////////////////////
// middleware config //
///////////////////////

app.use(cors())
app.use(bodyParser.json())
app.use(mongoSanitize())

const verifyToken = (req, res, next) => {
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY_PERIOD })
    console.log('verified')
    next()
  } catch(e) {
    console.log('failed verification')
    res.sendStatus(401)
  }
}



////////////
// routes //
////////////

app.get('/', (req, res) => {
  res.send('Hello from Node.js apasdfp \n')
})

app.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || ! await user.isValidPassword(req.body.password)) {
    res.sendStatus(401)
    return
  }
  const token = await jwt.sign(
    { _id: user._id, email: user.email }, 
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY_PERIOD }
  )
  res.status(200).json({ token })
})

app.post('/signup', async (req, res) => {
  const exists = await User.findOne({ email: req.body.email })
  if (exists) {
    res.sendStatus(401)
    return
  }
  const token = await jwt.sign(
    { _id: user._id, email: user.email }, 
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY_PERIOD }
  )
  await User.create({ email: req.body.email, password: req.body.password })
  res.status(200).json({ token })
})



////////////////////////
// routes - protected //
////////////////////////

app.post('/get-subjects', verifyToken, async (req, res) => {
  const subjects = await Test.getSubjects()
  res.status(200).json(subjects)
})

app.post('/get-subject-numbers', verifyToken, async (req, res) => {
  if (!req.body.subject) {
    res.sendStatus(400)
    return
  }
  const subject_numbers = await Test.getSubjectNumbers(req.body.subject)
  res.status(200).json(subject_numbers)
})

app.post('/get-subject-number-tests', verifyToken, async (req, res) => {
  if (!req.body.subject || !req.body.number) {
    res.sendStatus(400)
    return
  }
  const tests = await Test.getSubjectNumberTests(req.body.subject, req.body.number)
  res.status(200).json(tests)
})

app.post('/get-tests', verifyToken, async (req, res) => {
  // check filters valid
  if (!
    (req.body.sort === null || typeof(req.body.sort) === 'number') &&
    (req.body.order === null || req.body.order === 'asc' || req.body.order === 'desc') &&
    typeof(req.body.limit) === 'number' &&
    typeof(req.body.page) === 'number'
  ) {
    res.sendStatus(400)
    return
  }
  const skip = req.body.page * req.body.limit
  const limit = req.body.limit <= 25 ? req.body.limit : 25
  const [tests, count] = await Test.getTests(req.body.course, req.body.filters, req.body.sort, req.body.order, skip, limit)
  res.status(200).json({ 
    tests: tests,
    count: count
  })
})

app.post('/get-test-file', verifyToken, async (req, res) => {
  if (!req.body._id) {
    res.sendStatus(400)
    return
  }
  const test = await Test.findOne({ '_id': req.body._id }, 'test_file')
  res.sendFile(path.join(__dirname, 'data', test.test_file))
})

app.post('/get-filter-options', verifyToken, async (req, res) => {
  if (!req.body.course) {
    res.sendStatus(400)
    return
  }
  const options = await Test.getFilterOptions(req.body.course)
  res.status(200).json(options)
})

app.get('/tests', verifyToken, async (req, res) => {
  let skip = req.body.skip || 0
  let limit = req.body.limit || 50
  const tests = await Test.find({}, '_id course kind term professor.name test_file upload_time verified').skip(skip).limit(limit)
  res.status(200).json(tests)
})

app.post('/tests', verifyToken, async (req, res) => {
  let skip = req.body.skip || 0
  let limit = req.body.limit || 50
  const tests = await Test.find({}, '_id course kind term professor.name test_file upload_time verified').skip(skip).limit(limit)
  res.status(200).json(tests)
})



///////////////
// serve api //
///////////////

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
    connectDb().then(() => {
      console.log('MongoDb connected')
    })
})

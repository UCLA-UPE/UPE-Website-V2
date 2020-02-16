const express = require('express')
const bodyParser = require('body-parser')
const connectDb = require('./src/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')

// constants
// TODO: use envvars for these
const PORT = 8080
const HOST = '0.0.0.0'
const TOKEN_EXPIRY_PERIOD = '10d'

// envvars
const TEST_FILES_DIR = (process.env.PRODUCTION === 'false') ? 
  path.join(__dirname, '/../data/tests') : // dev: put test files in UPE-Website-V2/data/tests
  path.join(process.env.DATA_DIR, 'tests') // prod: pass in env var DATA_DIR where the "tests" folder lives
const JWT_SECRET = process.env.JWT_SECRET

console.log("TEST_FILES_DIR is set to " + TEST_FILES_DIR)

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
    jwt.verify(req.body.token, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_PERIOD })
    console.log('verified')
    next()
  } catch(e) {
    console.log('failed verification')
    res.sendStatus(401)
  }
}

const logger = (req, res, next) => {
  console.log(req.url)
  next()
}
app.use(logger)



/////////////
// utility //
/////////////

const signUserToken = async (_id, email) => await jwt.sign(
  { _id: _id, email: email }, 
  JWT_SECRET,
  { expiresIn: TOKEN_EXPIRY_PERIOD }
)

//////////////////////////
// routes - unprotected //
//////////////////////////

app.get('/', (req, res) => {
  res.send('UPE Web API is working!\n')
})

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || ! await user.isValidPassword(req.body.password)) {
    res.sendStatus(401)
    return
  }
  const token = await signUserToken(user._id, user.email)
  console.log(token)
  res.status(200).json({ token: token })
})

app.post('/signup', async (req, res) => {
  const exists = await User.findOne({ email: req.body.email })
  if (exists) {
    res.sendStatus(400)
    return
  }
  const user = await User.create({ email: req.body.email, password: req.body.password })
  const token = await signUserToken(user._id, user.email)
  res.status(200).json({ token: token })
})

app.get('/summary', async (req, res) => {
  const summary = await Test.countDocuments()
  res.status(200).json(summary)
})



////////////////////////
// routes - protected //
////////////////////////

app.post('/get-profile', verifyToken, async (req, res) => {
  const profile = await User.getProfile(req.body.token)
  res.status(200).json(profile)
})

app.post('/logout', verifyToken, async (req, res) => {
  // TODO: invalidate token
  res.sendStatus(200)
})

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
  res.sendFile(path.join(TEST_FILES_DIR, test.test_file))
})

app.post('/get-filter-options', verifyToken, async (req, res) => {
  if (!req.body.course) {
    res.sendStatus(400)
    return
  }
  const options = await Test.getFilterOptions(req.body.course)
  res.status(200).json(options)
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

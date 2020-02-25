const express = require('express')
const bodyParser = require('body-parser')
const connectDb = require('./connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')
const multer = require('multer')
const util = require('util')
const Mailer = require('./mailer')
const os = require('os')

// constants
// TODO: use envvars for these
const PORT = 8080
const HOST = '0.0.0.0'
const TOKEN_EXPIRY_PERIOD = '10d'
const TEST_FILE_UPLOAD_MAX_SIZE = 10 * 1024 * 1024 // in bytes

// env
const apiUrl = (process.env.PRODUCTION === 'false') ? 
  'http://localhost:' + PORT :             // dev
  'http://' + os.hostname() + ':' + PORT   // prod
console.log('api url is set to ' + apiUrl)
const TEST_FILES_DIR = (process.env.PRODUCTION === 'false') ? 
  path.join(__dirname, '/../../data/tests') : // dev: put test files in UPE-Website-V2/data/tests
  path.join(process.env.DATA_DIR, 'tests') // prod: pass in env var DATA_DIR where the 'tests' folder lives
const JWT_SECRET = process.env.JWT_SECRET

console.log('TEST_FILES_DIR is set to ' + TEST_FILES_DIR)

// mongoose models
const User = require('./User.model')
const Test = require('./Test.model')



// instantiate app and others
const app = express()
const mailer = new Mailer(apiUrl)

///////////////////////
// middleware config //
///////////////////////

app.use(cors())
app.use(bodyParser.json())
app.use(mongoSanitize())

const verifyToken = (req, res, next) => {
  try {
    const auth = req.get('Authorization')
    if (auth === undefined) {
      console.log('Authorization header missing')
      res.status(401).json({ reason: 'Authorization header missing' })
      return
    }
    const [schema, token] = auth.split(' ')
    jwt.verify(token, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_PERIOD })
    req.tokenPayload = jwt.decode(token)
    console.log('JWT verified')
    next()
  } catch(e) {
    console.log('JWT verification failed')
    res.status(401).json({ reason: 'JWT verification failed' })
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, TEST_FILES_DIR)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  }),
  limits: {
    // fieldNameSize: asdf,
    fieldSize: TEST_FILE_UPLOAD_MAX_SIZE,
    // fields: asdf,
    fileSize: TEST_FILE_UPLOAD_MAX_SIZE,
    // files: asdf,
    // parts: asdf,
    // headerPairs: asdf,
  }
})
const saveTestFile = upload.fields([
  { name: 'testFile', maxCount: 1 }
])

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
    res.status(401).json({ reason: 'Email does not exist, or password is wrong' })
    return
  }
  if (!user.isVerified()) {
    res.status(401).json({ reason: 'Please verify your email' })
    return
  }
  const token = await signUserToken(user._id, user.email)
  console.log(token)
  res.status(200).json({ token: token })
})

app.post('/signup', async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    res.status(400).json({ reason: 'Email address exists' })
    return
  }
  else if (!req.body.email.match(/@(.+\.)*ucla\.edu/)) {
    res.status(400).json({ reason: 'Email has to be a "ucla.edu" address' })
    return
  }
  // password will be encrypted before storage
  const user = await User.create({ email: req.body.email, password: req.body.password })
  mailer.sendEmailVerification(user.email, user.emailVerification.verificationString)
  res.sendStatus(200)
})

app.get('/verify-email/:verificationString', async (req, res) => {
  if (await User.verifyEmail(req.params.verificationString)) res.status(200).send('Email verified!')
  else res.sendStatus(401)
})

app.get('/summary', async (req, res) => {
  const summary = await Test.countDocuments()
  res.status(200).json(summary)
})



////////////////////////
// routes - protected //
////////////////////////

app.post('/get-profile', verifyToken, async (req, res) => {
  const profile = await User.getProfile(req.tokenPayload._id)
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

app.post('/upload-test-file', verifyToken, saveTestFile, async (req, res) => {
  if (!req.files) {
    res.sendStatus(400)
    return
  }
  const test = await Test.create({
    user_email: req.tokenPayload.email,
    course: {
      subject: req.body.courseSubject,
      number: req.body.courseNumber,
    },
    kind: {
      name: req.body.kindName,
      number: req.body.kindNumber !== 'undefined' ? req.body.kindNumber : null,
    },
    term: {
      quarter: req.body.termQuarter,
      year: req.body.termYear,
    },
    professor: {
      email: null,
      name: req.body.professorName,
    },
    test_file: req.files.testFile[0].filename,
    upload_time: Date.now(),
    verified: false,
  })
  res.status(200).json({ test_id: test._id })
})



///////////////
// serve api //
///////////////

async function start() {
  await mailer.init()
  app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
    connectDb().then(() => {
      console.log('MongoDb connected')
    })
  })
}

start()

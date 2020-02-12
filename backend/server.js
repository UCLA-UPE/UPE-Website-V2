const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connectDb = require('./src/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')

// some magic constants
const PORT = 8080
const HOST = '0.0.0.0'
const TOKEN_EXPIRY_PERIOD_DAYS = 30
const SECRET_PRIVATE_KEY = 'lmao'

// mongoose models
const User = require('./src/User.model')
const Test = require('./src/Test.model')



///////////////////////
// middleware config //
///////////////////////

app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())

// passport
// https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

// const verifyTokenMiddleware = (req, res, next) => {
//   const token = req.token
// }


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
    SECRET_PRIVATE_KEY, 
    { 'expiresIn': '10s' }
  )
  res.status(200).json({ token })
})

app.post('/signup', async (req, res) => {
  const exists = await User.findOne({ email: req.body.email })
  if (exists) {
    res.sendStatus(401)
    return
  }
  await User.create({ email: req.body.email, password: req.body.password })
  res.sendStatus(200)
})

//////////////////////////////////
// routes - token-authenticated //
//////////////////////////////////

app.post('/get-subjects', async (req, res) => {
  const subjects = await Test.getSubjects()
  res.status(200).json(subjects)
})

app.post('/get-subject-numbers', async (req, res) => {
  if (!req.body.subject) {
    res.sendStatus(400)
    return
  }
  const subject_numbers = await Test.getSubjectNumbers(req.body.subject)
  res.status(200).json(subject_numbers)
})

app.post('/get-subject-number-tests', async (req, res) => {
  if (!req.body.subject || !req.body.number) {
    res.sendStatus(400)
    return
  }
  const tests = await Test.getSubjectNumberTests(req.body.subject, req.body.number)
  res.status(200).json(tests)
})

app.post('/get-test-file', async (req, res) => {
  if (!req.body._id) {
    res.sendStatus(400)
    return
  }
  const testFile = await Test.getTestFile(req.body._id)
  res.status(200).json(testFile)
})

app.get('/tests', async (req, res) => {
  let skip = req.body.skip || 0
  let limit = req.body.limit || 50
  const tests = await Test.find({}, '_id course kind term professor.name test_file upload_time verified').skip(skip).limit(limit)
  res.status(200).json(tests)
})

app.post('/tests', async (req, res) => {
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

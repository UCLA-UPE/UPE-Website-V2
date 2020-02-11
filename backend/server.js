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



///////////////////////
// middleware config //
///////////////////////

app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())

// passport
// https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport



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

app.get('/user-create', async (req, res) => {
  const user = new User({ username: 'userTest' })

  await user.save().then(() => console.log('User created'))

  res.send('User created \n')
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



///////////////
// serve api //
///////////////

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
    connectDb().then(() => {
      console.log('MongoDb connected')
    })
})

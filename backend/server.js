const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connectDb = require('./src/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
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

passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  const exists = await User.findOne({ email })
  if (exists) {
    return done(null, false, { message: 'Email exists'})
  }
  const user = await User.create({ email, password })
  return done(null, user)
}))

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  const user = await User.findOne({ email })
  if (!user) {
    return done(null, false, { message: 'User not found' })
  }
  const validate = await user.isValidPassword(password)
  if (!validate) {
    return done(null, false, { message: 'Wrong Password' })
  }
  return done(null, user)
}))



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

// use passport custom callback to return proper json
app.post('/login', (req, res, next) => {
  passport.authenticate('login', { 'session': false }, async (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      res.sendStatus(401)
      return
    }
    const token = await jwt.sign(
      { _id: user._id, email: user.email }, 
      SECRET_PRIVATE_KEY, 
      { 'expiresIn': '10s' }
    )
    res.status(200).json({ token })
  })(req, res, next)
})

// use passport custom callback to return proper json
app.post('/signup', (req, res, next) => {
  passport.authenticate('signup', { 'session': false }, async (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      res.sendStatus(401)
      return
    }
    console.log('New user created: ' + user)
    res.sendStatus(200)
  })(req, res, next)
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

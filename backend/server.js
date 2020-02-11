const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connectDb = require('./src/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')

// some magic constants
const PORT = 8080
const HOST = '0.0.0.0'

// middleware config
app.use(cors())
app.use(bodyParser.json())

// mongoose models
const User = require('./src/User.model')



// routes
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
  console.log(req.body)
  const user = await User.findOne({ 'email': req.body.email }, 'password')
  console.log(user)
  const match = await bcrypt.compare(req.body.password, user.password)
  console.log(match)
  if (match) {
    console.log('Match!')
    res.sendStatus(200)
  }
  else {
    console.log('No Match')
    res.sendStatus(401)
  }
})

app.post('/register', async (req, res) => {
  const user = new User({ email: req.body.email, password: req.body.password })
  await user.save()
  console.log('New user created: ' + user.email)
  res.sendStatus(200)
})



// serve api
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
    connectDb().then(() => {
      console.log('MongoDb connected')
    })
})

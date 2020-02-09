const express = require("express")
const app = express()
const connectDb = require("./src/connection")

const PORT = 8080
const HOST = '0.0.0.0'

const User = require("./src/User.model")

app.get("/", (req, res) => {
  res.send("Hello from Node.js apasdfp \n")
})

app.get("/users", async (req, res) => {
  const users = await User.find()

  res.json(users)
})

app.get("/user-create", async (req, res) => {
  const user = new User({ username: "userTest" })

  await user.save().then(() => console.log("User created"))

  res.send("User created \n")
})

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)

    connectDb().then(() => {
      console.log("MongoDb connected")
    })
})

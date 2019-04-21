const { mongoose } = require('../db/mongoose')
const { User } = require('../models/user')

for (let i = 0; i < 80; i++) {
  let user = new User({
    username: "mockuser"+String(i),
    email: "mock"+String(i)+"@mock.com",
    password: "mock"+String(i)
  })
  user.save().then((result) => {
  }, (error) => {
    console.log(error)
  })
}

for (let i = 0; i < 10; i++) {
  let user = new User({
    username: "mockpro"+String(i),
    email: "mockpro"+String(i)+"@mock.com",
    password: "mockpro"+String(i),
    status: 2
  })
  user.save().then((result) => {
  }, (error) => {
    console.log(error)
  })
}

let user = new User({
  username: "user",
  email: "user",
  password: "user"
})
user.save().then((result) => {
}, (error) => {
  console.log(error)
})

user = new User({
  username: "user2",
  email: "user2",
  password: "user2",
  status: 2
})
user.save().then((result) => {
}, (error) => {
  console.log(error)
})

user = new User({
  username: "admin",
  email: "admin",
  password: "admin",
  status: 3
})
user.save().then((result) => {
}, (error) => {
  console.log(error)
})

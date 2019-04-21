const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // trim whitespace
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
    default: 1
  },
  numFollower: {
    type: Number,
    default: 0,
    required: true,
    min: 0
  },
  numFollowed: {
    type: Number,
    default: 0,
    required: true,
    min: 0
  },
  following: {
    type: [ObjectId],
    required: true,
		default: []
  },
  description: {
    type: String,
    maxlength: 200,
    required: true,
    default: "A new sour lime"
  }
})

UserSchema.statics.findByEmailPassword = function(email, password) {
  const User = this
  return User.findOne({
    email: email
  }).then((user) => {
    if (!user) {
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      })
    })
  })
}

UserSchema.statics.findByIdPassword = function(id, password) {
  const User = this

  return User.findOne({
    _id: id
  }).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      })
    })
  })
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
  const user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next();
  }
})


const User = mongoose.model('User', UserSchema)
module.exports = {
  User
}

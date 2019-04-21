/* student.js Student model */

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const Article = mongoose.model('Article', {
  userId: {
    type: ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  text: {
    type: String
  },

  like: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  status: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  }

})

module.exports = {
  Article
}

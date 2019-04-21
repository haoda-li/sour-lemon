/* student.js Student model */

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const Comment = mongoose.model('Comment', {
	userId: {
		type: ObjectId,
		required: true,
	},
	movieId: {
		type: Number,
		required: true,
	},
  stars: {
		type: Number,
		required: true,
		default: 0,
		min: 0,
		max: 5
	},
  text: {
    type: String
  },
	username: {
		type: String,
		required: true
	},
  like: {
    type: Number,
		required: true,
		default: 0,
		min: 0,
  }
})

module.exports = { Comment }

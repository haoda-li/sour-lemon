/* student.js Student model */

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const Collection = mongoose.model('Collection', {
	userId: {
		type: ObjectId,
		required: true,
	},
	movieId: {
		type: Number,
		required: true,
	}
})

module.exports = { Collection }

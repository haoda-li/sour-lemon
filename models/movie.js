/* student.js Student model */

const mongoose = require('mongoose')

const Movie = mongoose.model('Movie', {
	id: {
		type: Number,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true,
	},
	stars: {
		type: Number,
		required: true,
		default: 0,
		min: 0,
		max: 0
	},
	numComments: {
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	releaseDate:{
		type: String,
		required: true
	},
	genreIds:{
		type: Array,
		require:true
	},
	posterPath:{
		type: String,
		required: true
	},
	backdropPath:{
		type: String,
		required: true
	}
})
module.exports = { Movie }

const mongoose = require('mongoose')

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017'

// connect to our database
mongoose.connect(mongoURI, {
  reconnectTries: 100,
  reconnectInterval: 500,
  autoReconnect: true,
  useNewUrlParser: true,
  dbName: 'sourlemon'
})
  .catch(err => console.log('Mongo connection error', err))
module.exports = { mongoose }

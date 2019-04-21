const {
  Collection
} = require('../models/collection');
const {
  User
} = require('../models/user');
const {
  mongoose
} = require('../db/mongoose')

const { Movie } = require('../models/movie');

Movie.find({}, "id").then((movies) => {
  const ids = []
  movies.forEach((m) => ids.push(m.id))
  User.find({}, "_id").then((users) => {
    users.forEach((u) => {
      for (let i = 0; i < ids.length; i++) {
        if (Math.random() < 0.01) {
          const col = new Collection({
            userId: u._id,
            movieId: ids[i]
          });
          col.save().then((result) => {
            console.log(result)
          }, (error) => {
            console.log(error)
          })
        }
      }
    })


  })
}, (error) => {
  console.log(error)
})

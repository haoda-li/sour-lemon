const { mongoose } = require('../db/mongoose')
const { Movie } = require('../models/movie');
const { Comment } = require('../models/comment');

Movie.find({}, "id").then((movies) => {
  movies.forEach((m) => {
    let s1 = Math.floor(Math.random() * 5) + 1
    let s2 = Math.floor(Math.random() * 5) + 1
    let s3 = s1
    let numS = 1
    let comment = new Comment({
      userId: "5ca52a063eff8929c003e604",
      movieId: m.id,
      text: "This is a good movie!",
      stars: s1,
      username: "mockuser5",
      like: Math.floor(Math.random() * 233)
    });

    comment.save().then((result) => {
      console.log(result)
    }, (error) => {
      console.log(error)
    })

    if (Math.random() > 0.5){
      comment = new Comment({
        userId: "5ca5ad353984257b6cf2314f",
        movieId: m.id,
        text: "Nice movie, I love it!",
        stars: s2,
        username: "mockpro8",
        like: Math.floor(Math.random() * 233)
      });

      comment.save().then((result) => {
        console.log(result)
      }, (error) => {
        console.log(error)
      })
      s3 = Math.floor((s1 + s2) / 2)
      numS = 2
    }

    Movie.findOneAndUpdate({
      id: m.id
    }, {
      numComments: numS,
      stars: s3
    }).then((movie) => {})

  })
}, (error) => {
  console.log(error)
  console.log("error")
})

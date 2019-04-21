const {Movie} = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const http = require("https");


//get a movie by movie id
router.get('/movie/:mid', (req, res) => {
  const id = req.params.mid // the id is in the req.params object
  // Otheriwse, findById
  Movie.findOne({
    id: id
  }).then((movie) => {
    if (!movie) {
      res.status(404).send()
    } else {
      res.send(movie)
    }

  }).catch((error) => {
    res.status(500).send(error)
  })
})

// GET all movies
router.post('/loadMovie/:index', (req, res) => {
  Movie.find().sort({
    id: 1
  }).then((movies) => {
    if (movies.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(movies[req.params.index])
    }
  }, (error) => {
    res.status(500).send(error)
  })
})

//delete movie by id
router.delete('/:id', (req, res) => {
  const id = req.params.id

  // Good practise is to validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  // Otheriwse, findByIdAndRemove
  Movie.findByIdAndRemove(id).then((movie) => {
    if (!movie) {
      res.status(404).send()
    } else {
      res.send({
        movie
      })
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})

// load top 10 movies list
router.get('/load_movies/:pid', async (req, res) => {
    const pageNumber = req.params.pid;
    if(pageNumber < 1 || pageNumber >20){ // check valid id
        return res.status(404).send();
    }
    const startDate = `${2020-pageNumber}-01-01`;
    const endDate = `${2020-pageNumber}-12-31`;

    const movies = await Movie
        .find({ "releaseDate": { $gte: startDate, $lte: endDate}})//add error checking
        .limit(10)
        .sort({stars:-1})
    res.send(movies)
});


// search page
// get popular movies array according to given pageNumber and pageSize
router.get('/popular/movies/', async(req, res)=>{
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const movies = await Movie
    .find()
    .skip((pageNumber-1)*pageSize)
    .limit(pageSize)
    .sort({releaseDate: -1})
  res.send({"movies":movies})
})

// search page
// get related movies array according to given pageNumber and pageSize
router.get('/search/movies/', async(req, res)=>{
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const titleOrId = req.query.titleOrId;
  titleOrId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const isnum = /^\d+$/.test(titleOrId);
  if (isnum) {
    Movie.find({
      $or: [{
        title: new RegExp('^.*' + titleOrId + '.*$', "i")
      }, {
        id: titleOrId
      }]
    })
    .skip((pageNumber-1)*pageSize)
    .limit(pageSize)
    .sort({releaseDate: -1})
    .then((movies) => {
      if (!movies) {
        res.status(404).send()
      } else {
        res.send({
          movies
        })
      }
    })
  } else {
    Movie.find({
      title: new RegExp('^.*' + titleOrId + '.*$', "i")
    })
    .skip((pageNumber-1)*pageSize)
    .limit(pageSize)
    .sort({releaseDate: -1})
    .then((movies) => {
      if (!movies) {
        res.status(404).send()
      } else {
        res.send({
          movies
        })
      }
    })
  }
})

//Search movie by ID and title
router.post('/searchmovie/:index', (req, res) => {
  const titleOrId = req.body.titleOrId
  titleOrId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const isnum = /^\d+$/.test(titleOrId);
  if (isnum) {
    Movie.find({
      $or: [{
        title: new RegExp('^.*' + titleOrId + '.*$', "i")
      }, {
        id: titleOrId
      }]
    }).sort({
      id: 1
    }).then((movie) => {
      if (!movie) {
        res.status(404).send()
      } else {
        if (movie.length <= req.params.index) {
          res.status(202).send()
        } else {
          res.send(movie[req.params.index])
        }
      }
    })
  } else {
    Movie.find({
      title: new RegExp('^.*' + titleOrId + '.*$', "i")
    }).sort({
      id: 1
    }).then((movie) => {
      if (!movie) {
        res.status(404).send()
      } else {
        if (movie.length <= req.params.index) {
          res.status(202).send()
        } else {
          res.send(movie[req.params.index])
        }
      }
    })
  }
})


// Get stars of this moive
router.get('/stars/:mid', (req, res) => {
  Movie.findOne({
    id: req.params.mid
  }).then((movie) => {
    if (!movie) {
      res.status(404).send()
    } else {
      res.send(String(movie.stars))
    }
  }, (error) => {
    res.status(500).send(error)
  })
})


// Admin uses this router to add new movie
router.post('/add-new-movie/:id', async (req, res) => {
    const mid = req.params.id // the id is in the req.params object
    const movieInDB = await Movie.find({id: mid}) //add error checking
    if(movieInDB.length !=0){
        return res.status(401).send()
    }
    var options = {
        "method": "GET",
        "hostname": "api.themoviedb.org",
        "port": null,
        "path": `https://api.themoviedb.org/3/movie/${mid}?api_key=232289fb6be8a10b493933bc73167e42&language=en-US`,
        "headers": {}
    };
    const apiReq = http.request(options, function(apiRes) {
        const chunks = [];
        apiRes.on("data", function(chunk) {
          chunks.push(chunk);
        });
        apiRes.on("end", function() {
            var body = Buffer.concat(chunks);
            const result = JSON.parse(body);
            if(result.status_code == 34){
               return res.status(404).send();
            }
            const movie = new Movie({
              id: result.id,
              title: result.title,
              stars: 0,
              numComments: 0,
              genreIds: result.genre_ids,
              releaseDate: result.release_date,
              posterPath: result.poster_path,
              backdropPath: result.backdrop_path
            });
            movie.save().then((result) => {
                res.send({ movie });
            }, (error) => {
                res.status(400).send(error) // 400 for bad request
            });
        });
    });
    apiReq.write("{}");
    apiReq.end();
})

//get a movie by movie id
router.get('/:mid', (req, res) => {
  const id = req.params.mid // the id is in the req.params object
  // Otheriwse, findById
  Movie.findOne({
    id: id
  }).then((movie) => {
    if (!movie) {
      res.status(404).send()
    } else {
      res.send(movie)
    }

  }).catch((error) => {
    res.status(500).send(error)
  })
})
module.exports = router;

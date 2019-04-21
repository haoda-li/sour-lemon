// Run this file will insert the 400 most popular movies into the database

const log = console.log
const http = require("https");
const { mongoose } = require('./db/mongoose')
const {Movie} = require('./models/movie')

// for (let i = 1; i < 21; i++) {
//   var options = {
//     "method": "GET",
//     "hostname": "api.themoviedb.org",
//     "port": null,
//     "path": "/3/discover/movie?api_key=232289fb6be8a10b493933bc73167e42&sort_by=vote_count.desc&primary_release_date.gte=2005&vote_count.gte=7.2&page="+i,
//     "headers": {}
//   };

//   const req = http.request(options, function(res) {
//     const chunks = [];

//     res.on("data", function(chunk) {
//       chunks.push(chunk);
//     });

//     res.on("end", function() {
//       var body = Buffer.concat(chunks);
//       const result = JSON.parse(body);
//       result.results.forEach((x) => {
//         const movie = new Movie({
//           id: x.id,
//           title: x.title,
//           stars: 0,
//           numComments: 0,
//           genreIds: x.genre_ids, 
//           releaseDate: x.release_date,
//           posterPath: x.poster_path,
//           backdropPath: x.backdrop_path
//         });
//         movie.save();
//       })
//     });
//   });

//   req.write("{}");
//   req.end();
// }

// for (let i = 1; i < 2; i++) {
//   var options = {
//     "method": "GET",
//     "hostname": "api.themoviedb.org",
//     "port": null,
//     "path": "/3/movie/now_playing?api_key=042cb5f6e3db002d154f68dd7c3f4e90&language=en-US&page="+i,
//     "headers": {}
//   };

//   const req = http.request(options, function(res) {
//     const chunks = [];

//     res.on("data", function(chunk) {
//       chunks.push(chunk);
//     });

//     res.on("end", function() {
//       var body = Buffer.concat(chunks);
//       const result = JSON.parse(body);
//       result.results.forEach((x) => {
//         const movie = new Movie({
//           id: x.id,
//           title: x.title,
//           stars: 0,
//           numComments: 0,
//           genreIds: x.genre_ids, 
//           releaseDate: x.release_date,
//           posterPath: x.poster_path,
//           backdropPath: x.backdrop_path
//         });
//         movie.save();
//       })
//     });
//   });

//   req.write("{}");
//   req.end();
// }

// fetch("https://api.themoviedb.org/3/movie/381288?api_key=232289fb6be8a10b493933bc73167e42&language=en-US")
//   .then(function(res) {
//     if (res.status === 200) {
//         res.json().then(moivesArray => {
//             console.log(moivesArray)
//           })
//         }
//     })
//   .catch((error) => {
//     console.log(error) 
//   })
var options = {
      "method": "GET",
      "hostname": "api.themoviedb.org",
      "port": null,
      "path": "https://api.themoviedb.org/3/movie/381288?api_key=232289fb6be8a10b493933bc73167e42&language=en-US",
      "headers": {}
};
const req = http.request(options, function(res) {
      const chunks = [];
  
      res.on("data", function(chunk) {
        chunks.push(chunk);
      });
  
      res.on("end", function() {
        var body = Buffer.concat(chunks);
        const result = JSON.parse(body);
        const movie = new Movie({
          id: result.id,
          title: result.title,
          stars: 0,
          numComments: 0,
          genreIds: result.genre_ids, 
          releaseDate: result.release_date,
          posterPath: result.poster_path,
          backdropPath: results.backdrop_path
        });
      });
});
req.write("{}");
req.end();
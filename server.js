'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const request = require("request");

const {
  ObjectID
} = require('mongodb');

const fs = require('fs');


// mongoose connection
const {
  mongoose
} = require('./db/mongoose');

// Import the models
const {
  Article
} = require('./models/article')
const {
  Collection
} = require('./models/collection')
const {
  Comment
} = require('./models/comment')

const {
  Movie
} = require('./models/movie')
const {
  User
} = require('./models/user')


// Import the routes
const users = require('./routes/users');
const movies = require('./routes/movies');
const comments = require('./routes/comments');
const articles = require('./routes/articles');
const collections = require('./routes/collections');

// express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// Add express session
app.use(session({
  secret: 'oursecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
    httpOnly: true
  }
}))

// connect routes
app.use('/api/users', users)
app.use('/api/movies', movies)
app.use('/api/comments', comments)
app.use('/api/articles', articles)
app.use('/api/collections', collections)


/**--------PAGES---------**/
// static js directory
app.use("/pub", express.static(__dirname + '/pub'))


/**--------Main page---------**/
app.get('/index', (req, res) => {
  res.render('index.hbs')
})

app.get('/', (req, res) => {
  res.redirect('index')
})



/**--------Search page---------**/
app.get("/search/:mid", (req, res) => {
  res.render('search.hbs', {
    movieId: req.params.mid,
    Tabs: `<a href="#result" class = "mdl-tabs__tab index_text is-active" id="search-result">Search Result</a>
    <a href="#movies" class = "mdl-tabs__tab index_text" id="now-playing">Now Playing</a>`,
    Panels: `<div id="result" class='mdl-tabs__panel is-active'>
    </div>
    <div id="movies" class='mdl-tabs__panel'>
    </div>`
  })
})

app.get("/popular", (req, res) => {
  res.render('search.hbs', {
    movieId: "popular",
    Tabs: `<a href="#result" class = "mdl-tabs__tab index_text" id="search-result">Search Result</a>
    <a href="#movies" class = "mdl-tabs__tab index_text is-active" id="now-playing">Now Playing</a>`,
    Panels: `<div id="result" class='mdl-tabs__panel '>
    </div>
    <div id="movies" class='mdl-tabs__panel is-active'>
    </div>`
  })
})


app.get('/admin', (req, res) => {
  if (req.session.user) {
    res.render('admin.hbs')
  } else {
    res.redirect('/signin')
  }
})

app.get('/user_main', (req, res) => {
  if (req.session.user) {
    const id = req.session.user;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    User.findById(id).then((user) => {
      let avartar_loc = "pub/assets/user_main/" + user._id;
      if (!fs.existsSync(avartar_loc)) {
        avartar_loc = "pub/assets/user_main/lemon.png";
      }
      //find to add article or not
      let articleTab = "<a href=\"#articles\" class=\"mdl-tabs__tab\">Articles</a>";
      if (user.status === 1) {
        articleTab = "";
      }
      res.render('user_main.hbs', {
        username: user.username,
        description: user.description,
        followers: user.numFollower,
        following: user.numFollowed,
        avatar: avartar_loc,
        articleTab: articleTab
      })
    }).catch((error) => {
      res.status(500).send()
    })
  } else {
    res.redirect('/signin')
  }
});

//add user_view router
app.get('/user_view/:id', (req, res) => {
  let followButton = "follow";
  const id = req.params.id;
  if (req.session.user && req.session.user == id) {
    return res.redirect('/user_main')
  }
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send()
    }
    //find avatar location
    let avartar_loc = "pub/assets/user_main/" + id;
    if (!fs.existsSync(avartar_loc)) {
      avartar_loc = "/pub/assets/user_main/lemon.png";
    } else {
      avartar_loc = "/pub/assets/user_main/" + id;
    }
    //find to add article or not
    let articleTab = "<a href=\"#articles\" class=\"mdl-tabs__tab\">Articles</a>";
    if (user.status === 1) {
      articleTab = "";
    }
    //find follow or unfollow
    if (req.session.user) {
      User.findById(req.session.user).then((theUser) => {
        const followed = theUser.following.filter((val) => {
          return val.toString() === id.toString();
        });
        if (followed.length !== 0) {
          followButton = "unfollow";
        }
        res.render('user_view.hbs', {
          username: user.username,
          description: user.description,
          followers: user.numFollower,
          following: user.numFollowed,
          followButton: followButton,
          avatar: avartar_loc,
          articleTab: articleTab
        })
      })
    } else {
      res.render('user_view.hbs', {
        username: user.username,
        description: user.description,
        followers: user.numFollower,
        following: user.numFollowed,
        followButton: followButton,
        avatar: avartar_loc,
        articleTab: articleTab
      })
    }

  }).catch((error) => {
    console.log(error);
    res.status(500).send()
  });
});

//admin logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error)
    } else {
      res.redirect('/signin')
    }
  })
});


app.get('/article/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send()
  } else {
    res.render('article.hbs', {
      id: req.params.id
    })
  }
})

app.get('/signin', (req, res) => {
  if (req.session.user) {
    const id = req.session.user;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    User.findById(id).then((user) => {
      if (Number(user.status) === 3) {
        res.redirect('/admin')
      } else {
        res.redirect('/user_main')
      }
    }).catch((error) => {
      res.status(500).send()
    });

  } else {
    res.render('signin.hbs')
  }
})

app.get('/signup', (req, res) => {
  res.render('signup.hbs')
})


app.get('/editor/:mid', (req, res) => {
  Movie.findOne({
    id: req.params.mid
  }).then((movie) => {
    if (!movie) {
      res.status(404).send()
    } else {
      res.render('editor.hbs', {
        movie: movie.title,
        mid: req.params.mid
      })
    }
  }).catch((error) => {
    res.status(500).send()
  })
})

app.get('/movie/:mid', (req, res) => {
  Movie.findOne({
    id: req.params.mid
  }).then((movie) => {
    if (!movie) {
      res.status(404).send()
    } else {
      if (req.session.user && ObjectID.isValid(req.session.user)) {
        User.findById(req.session.user).then((user) => {
          const status = user.status
          Collection.findOne({
            userId: req.session.user,
            movieId: req.params.mid
          }).then((col) => {
            if (col) {
              res.render('movie.hbs', {
                mid: req.params.mid,
                user: status,
                col_icon: "done",
                col_text: "In Collection"
              })
            } else {
              res.render('movie.hbs', {
                mid: req.params.mid,
                user: status,
                col_icon: "add",
                col_text: "Add to Collection"
              })
            }
          }).catch((error) => {})
        }).catch((error) => {})

      } else {
        res.render('movie.hbs', {
          mid: req.params.mid,
          user: 0,
          col_icon: "add",
          col_text: "Add to Collection"
        })
      }
    }
  }).catch((error) => {
    res.status(500).send()
  })
})




/**--------USER MAIN---------**/

app.listen(port, () => {
  log(`Listening on port ${port}...`)
});

const { User } = require('../models/user');
const { Movie } = require('../models/movie');
const { Comment } = require('../models/comment');
const { Article } = require('../models/article');
const {Collection} = require('../models/collection');
const {
  ObjectID
} = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//<---Helen-->
// GET all users
router.get('/loadUser/:index', (req, res) => {
  User.find().sort({
    status:-1,
    _id: 1
  }).then((users) => {
    if (users.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(users[req.params.index])
    }
  }, (error) => {
    res.status(500).send(error)
  })
})

//Search user by username
router.post('/username/:index', (req, res) => {
  const username = req.body.username
  username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  User.find({
    username: new RegExp('^.*' + username + '.*$', "i")
  }).sort({
    email: 1
  }).then((user) => {
    if (!user) {
      res.status(404).send()
    } else {
      if (user.length <= req.params.index) {
        res.status(202).send()
      } else {
        res.send(user[req.params.index])
      }
    }
  })
})


//delete user
router.delete('/:id', (req, res) => {
  const id = req.params.id

  // Good practise is to validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  // Otheriwse, findByIdAndRemove
  User.findByIdAndRemove(id).then((user) => {
    if (!user) {
      res.status(404).send()
    } else {
      res.send({
        user
      })
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})

//delete articles and comments with user id
router.delete('/articlesncomments/:id', async (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  // Otheriwse, findByIdAndRemove
  const articles = await Article.find({userId: id}).remove()
  const comments = await Comment.find({userId: id}).remove()

  res.send({articles, comments})
})

//delete articles and comments and collections with movie id
router.delete('/marticlesncommentsncollections/:id', async (req, res) => {
  const id = req.params.id

  // Otheriwse, findByIdAndRemove
  const articles = await Article.find({movieId: id}).remove()
  const comments = await Comment.find({movieId: id}).remove()
  const collections = await Collection.find({movieId: id}).remove()

  res.send({articles, comments, collections})
})

//Switch user's status
router.post('/userssw/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  User.findOne({
    _id: id
  }).then((user) => {
    if (!user) {
      res.status(404).send()
    } else {
      if (Number(user.status) == 1) {
        user.status = 2
      } else {
        user.status = 1
      }
      user.save(function(err, updatedUser) {
        res.send({
          updatedUser
        })
      });
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})

//admin check user's old password
router.get('/admin/checkpw/:pw', (req, res) => {
  const oldpw = req.params.pw
  const id = req.session.user

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  User.findByIdPassword(id, oldpw).then((user) => {
    if (!user) {
      res.status(400).send()
    } else {
      res.send(user)
    }
  }, (rej) => {
    res.status(400).send()
  })

})

//admin change user's password
router.post('/admin/changepw/:pw', (req, res) => {
  const pw = req.params.pw
  const id = req.session.user

  if (!ObjectID.isValid(id)) {
    return res.status(403).send()
  }

  User.findOne({
    _id: id
  }).then((user) => {
    if (!user) {
      res.status(404).send()
    } else {
      user.password = pw
      user.save(function(err, updatedUser) {
        res.send({
          updatedUser
        })
      });
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})
//<---Helen-->


//SIGN IN
router.post('/signin', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findByEmailPassword(email, password).then((user) => {
    if (!user) {
      res.status(400).send()
    } else {
      // Add the user to the session cookie that we will
      // send to the client
      req.session.user = user._id;
      res.send(user)
    }
  }).catch((error) => {
    res.status(400).send()
  })
})

// / SIGN UP
router.post('/signup', (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  user.save().then((result) => {
    // Save and send object that was saved
    res.send(result)
  }, (error) => {
    console.log(error)
    res.status(400).send(error) // 400 for bad request
  })
})

// Post comment
router.post('/comment/:mid', (req, res) => {
  if (!req.session.user || !ObjectID.isValid(req.session.user)) {
    res.status(404).send()
  }

  User.findById(req.session.user).then((user) => {
    Comment.findOne({
      userId: req.session.user,
      movieId: req.params.mid
    }).then((com) => {
      if (!com) {
        const comment = new Comment({
          userId: req.session.user,
          movieId: req.params.mid,
          text: req.body.text,
          stars: req.body.stars,
          username: user.username
        })

        comment.save().then((result) => {
          res.send(result)
        }, (error) => {
          res.status(500).send(error)
        })

        Movie.findOne({
          id: req.params.mid
        }).then((movie) => {

          const numS = movie.numComments + 1
          const newStars = Math.round((movie.stars * movie.numComments + req.body.stars) / numS)
          Movie.findOneAndUpdate({
            id: req.params.mid
          }, {
            numComments: numS,
            stars: newStars
          }).then((movie) => {})
        })
      } else {
        res.status(202).send()
      }
    })
  }, (error) => {
    console.log(error)
    res.status(500).send(error)
  })
})

// create article
router.post('/article/:mid', (req, res) => {
  if (!req.session.user || !ObjectID.isValid(req.session.user)) {
    res.status(202).send()
  }

  User.findById(req.session.user).then((user) => {
    if (user.status != 2) {
      res.status(201).send()
    } else {
      const article = new Article({
        userId: req.session.user,
        movieId: req.params.mid,
        text: req.body.text,
        title: req.body.title,
        username: user.username
      })
      article.save().then((result) => {
        res.send(result)
      }, (error) => {
        console.log(error)
        res.status(400).send(error)
      })
    }
  }, (error) => {
    console.log(error)
    res.status(400).send(error)
  })
})

// upload avatar
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,  './pub/assets/user_main')
    },
    filename: function(req, file, cb) {
        cb(null, req.body.id);
    }
});
const upload = multer({
    storage: storage
});

router.post("/user_main/avatar", upload.single('image'), (req, res) => {
    res.send(req.body)
});


//get user id
router.get("/user/get_id", (req, res) => {
    //if initialize takes too much time, then back to signin
    if (req.session.user) {
        const id = req.session.user;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        res.send({
            id
        });
    } else {
        res.render('signin.hbs')
    }
});

//update user name and comment
router.patch('/user/change_info/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } else {
        //test
        //console.log(req.body)
        User.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                username: req.body.username,
                description: req.body.description
            }
        }, {
            new: true
        })
            .then((user) => {
                if (!user) {
                    res.status(404).send()
                } else {
                    res.send(user)
                }
            }).catch((err) => {
            console.log(err)
        })
    }
});

//to increase follower
router.patch("/user/increase_follower/:id", (req, res) => {
    if (!req.session.user) {
        return res.status(404).send("please log in");
    }
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    User.findByIdAndUpdate(req.session.user, {
        $inc: {
            numFollowed: 1
        },
        $push: {
            following: id
        }
    }).then((result1) => {
        User.findByIdAndUpdate(id, {
            $inc:{
                numFollower: 1
            }
        }).then((result2) => {
            const followed = result1.following.filter((val) => {
                return val.toString() === id.toString();
            });
            if (followed.length === 0) {
                res.send({
                    opponentNumFollower: result2.numFollower,
                    selfNumFollowed: result1.numFollowed
                })
            }else {
                User.findByIdAndUpdate(req.session.user, {
                    $inc: {
                        numFollowed: -1
                    },
                    $pull: {
                        following: id
                    }
                }).then((result1) => {
                    User.findByIdAndUpdate(id, {
                        $inc:{
                            numFollower: -1
                        }
                    }).then((result2) => {
                        return res.status(400).send()
                    }, (error) => {
                        return res.status(500).send()
                    })
                }, (error) => {
                    return res.status(500).send()
                });
            }
        }, (error) => {
            return res.status(500).send()
        })
    }, (error) => {
        return res.status(500).send()
    });
});

//to decrease follower
router.patch("/user/decrease_follower/:id", (req, res) => {
    if (!req.session.user) {
        return res.status(404).send("please log in");
    }
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    User.findByIdAndUpdate(req.session.user, {
        $inc: {
            numFollowed: -1
        },
        $pull: {
            following: id
        }
    }).then((result1) => {
        User.findByIdAndUpdate(id, {
            $inc:{
                numFollower: -1
            }
        }).then((result2) => {
            const followed = result1.following.filter((val) => {
                return val.toString() === id.toString();
            });
            if (followed.length === 1) {
                res.send({
                    opponentNumFollower: result2.numFollower,
                    selfNumFollowed: result1.numFollowed
                })
            }else{
                User.findByIdAndUpdate(req.session.user, {
                    $inc: {
                        numFollowed: 1
                    },
                    $push: {
                        following: id
                    }
                }).then((result1) => {
                    User.findByIdAndUpdate(id, {
                        $inc:{
                            numFollower: 1
                        }
                    }).then((result2) => {
                        return res.status(400).send()
                    }, (error) => {
                        return res.status(500).send()
                    })
                }, (error) => {
                    return res.status(500).send()
                });
            }

        }, (error) => {
            return res.status(500).send()
        })
    }, (error) => {
        return res.status(500).send()
    });
});
module.exports = router;

const {
  Comment
} = require('../models/comment');
const mongoose = require('mongoose');
const express = require('express');
const {
  ObjectID
} = require('mongodb');
const router = express.Router();


// Get the top comment
router.get('/top/:cid', (req, res) => {
  const id = req.params.cid
  id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const isnum = /^\d+$/.test(id);
  if (isnum && (!(id === ""))) {
    Comment
      .find({
        movieId: id
      })
      .sort({
        like: -1
      })
      .limit(1)
      .then((comment) => {
        if (!comment) {
          res.status(404).send()
        } else {
          res.send({
            comment
          })
        }
      })
  }
})

// GET all comments
router.get('/loadComment/:index', (req, res) => {
  Comment.find().sort({
    _id: -1
  }).then((comments) => {
    if (comments.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(comments[req.params.index])
    }
  }, (error) => {
    console.log(error)
    res.status(500).send(error)
  })
})


router.get("/total/likes/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Comment.find({
    userId: id
  }).then((comments) => {
    if (!comments) {
      res.status(404).send()
    } else {
      const totalLike = comments.reduce((total, comment) => {
        return total + comment.like;
      }, 0);
      res.send({
        like: totalLike
      })
    }
  }, (error) => {
    res.status(500).send(error)
  })
});




//Search comments by movie ID and username
router.post('/searchComment/:index', (req, res) => {
  const id = req.body.id
  let username = req.body.username
  id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const isnum = /^\d+$/.test(id);
  if (username === "") {
    username = '.*'
  }

  if (isnum && (!(id === ""))) {
    Comment.find({
      $and: [{
          movieId: id
        },
        {
          username: new RegExp('^' + username + '$', "i")
        }
      ]
    }).sort({
      _id: -1
    }).then((comment) => {
      if (!comment) {
        res.status(404).send()
      } else {
        if (comment.length <= req.params.index) {
          res.status(202).send()
        } else {
          res.send(comment[req.params.index])
        }
      }
    })
  } else {
    Comment.find({
      username: new RegExp('^' + username + '$', "i")
    }).sort({
      _id: -1
    }).then((comment) => {
      if (!comment) {
        res.status(404).send()
      } else {
        if (comment.length <= req.params.index) {
          res.status(202).send()
        } else {
          res.send(comment[req.params.index])
        }
      }
    })
  }
})


// like the comment
router.post('/like/:obj/:bool', (req, res) => {
  const num = parseInt(req.params.bool) === 1 ? 1 : -1
  Comment.findByIdAndUpdate(req.params.obj, {
    $inc: {
      like: num
    }
  }).then((comment) => {
    if (!comment) {
      res.status(400).send()
    } else {
      res.send(String(comment.like + num))
    }
  }, (error) => {
    res.status(500).send(error)
  })
})

//get comments for current user
router.get('/userComments/:user_id', (req, res) => {
  Comment.find({
    userId: req.params.user_id,
  }).then((comments) => {
    if (!comments) {
      return res.status(404).send();
    }
    res.send({
      comments
    })
  }, (error) => {
    console.log(error);
    res.status(500).send(error)
  })
});


// Get comments for movie index
router.get('/:mid/:index', (req, res) => {
  Comment.find({
    movieId: req.params.mid,
  }).sort({
    like: -1
  }).then((comments) => {
    if (comments.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(comments[req.params.index])
    }
  }, (error) => {
    console.log(error)
    res.status(500).send(error)
  })
})

//Delete comment
router.delete('/:cid', (req, res) => {
  const id = req.params.cid

  // Good practise is to validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  // Otheriwse, findByIdAndRemove
  Comment.findByIdAndRemove(id).then((comment) => {
    if (!comment) {
      res.status(404).send()
    } else {
      res.send({
        comment
      })
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})


module.exports = router;

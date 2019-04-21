const {Article} = require('../models/article');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

//get all articles
router.get('/loadUnreviewedArticle/:index', (req, res) => {
  Article.find({status: 0}).sort({
    _id: -1
  }).then((articles) => {
    if (articles.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(articles[req.params.index])
    }
  }, (error) => {
    console.log(error)
    res.status(500).send(error)
  })
})

router.get('/loadReviewedArticle/:index', (req, res) => {
  Article.find({status: 1}).sort({
    _id: -1
  }).then((articles) => {
    if (articles.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(articles[req.params.index])
    }
  }, (error) => {
    console.log(error)
    res.status(500).send(error)
  })
})

//aprove articles
router.post('/approve/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Article.findOne({
    _id: id
  }).then((article) => {
    if (!article) {
      res.status(404).send()
    } else {
      if (Number(article.status) === 0) {
        article.status = 1
      }
      article.save(function(err, updatedArticle) {
        res.send({
          updatedArticle
        })
      });
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})

//delete/reject articles
router.delete('/:id', (req, res) => {
  const id = req.params.id

  // Good practise is to validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  // Otheriwse, findByIdAndRemove
  Article.findByIdAndRemove(id).then((article) => {
    if (!article) {
      res.status(404).send()
    } else {
      res.send({
        article
      })
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})

//Search articles by movie ID and username
router.post('/searchArticle/:index/:status', (req, res) => {
  const id = req.body.id
  let username = req.body.username
  id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const isnum = /^\d+$/.test(id);
  if (username === "") {
    username = '.*'
  }

  if (isnum && (!(id === ""))) {
    Article.find({
      $and: [{
          movieId: id
        },
        {
          username: new RegExp('^' + username + '$', "i")
        },
        {status: Number(req.params.status)}
      ]
    }).sort({
      _id: -1
    }).then((article) => {
      if (!article) {
        res.status(404).send()
      } else {
        if (article.length <= req.params.index) {
          res.status(202).send()
        } else {
          res.send(article[req.params.index])
        }
      }
    })
  } else {
    Article.find({
      $and: [
        {
          username: new RegExp('^' + username + '$', "i")
        },
        {status: Number(req.params.status)}
      ]
    }).sort({
      _id: -1
    }).then((article) => {
      if (!article) {
        res.status(404).send()
      } else {
        if (article.length <= req.params.index) {
          res.status(202).send()
        } else {
          res.send(article[req.params.index])
        }
      }
    })
  }
})

// Get the content of the article given the id
router.get('/content/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      res.status(400).send()
    } else {
      Article.findById(req.params.id).then((article) => {
        if (!article) {
          res.status(404).send()
        } else {
          res.send(article)
        }
      }, (error) => {
        res.status(500).send()
      })
    }
})

// Find articles by movieID
router.get('/movies/:mid/:index', (req, res) => {
  Article.find({
    movieId: req.params.mid,
    status: 1
  }).sort({
    like: -1
  }).then((articles) => {
    if (articles.length <= req.params.index) {
      res.status(202).send()
    } else {
      res.send(articles[req.params.index])
    }
  }, (error) => {
    console.log(error)
    res.status(500).send(error)
  })
})

// love the article
router.post('/loveArticle/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(403).send()
  }

  Article.findOne({
    _id: id
  }).then((article) => {
    if (!article) {
      res.status(404).send()
    } else {
      article.like += 1
      article.save(function(err, updatedArticle) {
        res.send(
          updatedArticle
        )
      });
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
});

//get articles for current user
router.get('/user/article/:user_id', (req, res) => {
    Article.find({
        userId: req.params.user_id,
    }).then((articles) => {
        if (!articles) {
            return res.status(404).send();
        }
        res.send({
            articles
        })
    }, (error) => {
        console.log(error)
        res.status(500).send(error)
    })
});

module.exports = router;

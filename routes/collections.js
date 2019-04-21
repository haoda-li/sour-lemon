const {Collection} = require('../models/collection');
const {
  ObjectID
} = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// add the collection
router.post('/:mid', (req, res) => {
  if (!req.session.user || !ObjectID.isValid(req.session.user)) {
    res.status(404).send()
  }
  const col = new Collection({
    userId: req.session.user,
    movieId: req.params.mid
  })
  col.save().then((result) => {
    res.send("added")
  }, (error) => {
    res.status(400).send(error)
  })
})

// remove the collection
router.delete('/:mid', (req, res) => {
  if (!req.session.user || !ObjectID.isValid(req.session.user)) {
    res.status(404).send()
  }
  Collection.findOneAndRemove({
    userId: req.session.user,
    movieId: req.params.mid
  }).then((col) => {
    if (!col) {
      res.status(404).send()
    } else {
      res.send("removed")
    }
  }).catch((error) => {
    res.status(500).send(error)
  })
})

//get collections for current user
router.get('/user/:user_id', (req, res) => {
    Collection.find({
        userId: req.params.user_id,
    }).then((collections) => {
        if (!collections) {
            return res.status(404).send();
        }
        res.send({
            collections
        })
    }, (error) => {
        console.log(error)
        res.status(500).send(error)
    })
});

module.exports = router;

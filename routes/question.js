'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
// const linkedList = require('../utils/LinkedList');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

router.get('/', (req, res, next) => {
  // i need to know the user id
  const userId = req.user.id;
  
  return User.findOne({_id: userId})
    .then(user => {
      if (user) {
        const question = user.questions[user.head];
        console.log(question);
        res.json(question);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  // not finished, need to have an M value
  const questionToPost = req.body.question;
  // linkedList.deleteFirst();
  linkedList.insertLast(questionToPost);
  // posts the next one
  res.send('posted');
});


module.exports = router;
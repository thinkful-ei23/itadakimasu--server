'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.get('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id;

  User.findOne({_id: userId})
    .then(user => {
      if (user) {
        const questions = user.questions.map((question, index) => ({
          index,
          question: question.question,
          attempts: question.attempts,
          successes: question.successes
        }));
        res.json(questions);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
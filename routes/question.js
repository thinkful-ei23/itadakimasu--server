'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const seedUsers = require('../db/seed/users.json'); // get rid of when front-end is working
// const linkedList = require('../utils/LinkedList');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.get('/', jwtAuth, (req, res, next) => {
  // i need to know the user id
  const userId = req.user.id;
  
  User.findOne({_id: userId})
    .then(user => {
      const question = user.questions[user.head];
      console.log(question);
      res.json(question);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', jwtAuth, (req, res, next) => {
  // bring back once front end is working

  // initial values from the answered question
  const answeredQuestion = req.body; // save the node that you just answered
  const mToMove = answeredQuestion.memoryStr; 
  const newHead = answeredQuestion.next;
  const userId = req.user.id;
  
  User.findOne({_id: userId}) 
    .then(user => {
      const currentHead = user.questions[user.head]; //save the value of the current head
      const currentHeadIndex = user.head;  //save the value of the current head's index
      let currentNode = currentHead;

      for (let i = currentHeadIndex; i <= currentHeadIndex + mToMove + 1; i++) {
        currentNode = user.questions[i];
      }
      console.log('list of user questions', user.questions);
      console.log(currentNode, 'currentNode after loop');
    
      const oldCurrentNodeNext = currentNode.next; 
  
      User.findByIdAndUpdate(user._id, {$set: {'head': newHead}}, {new : true})
        .then(result => {
          if (result) {
            console.log('changing head: should be 1', result);
            // res.json(result);
          } else {
            next();
          }
        })
        .catch(err => {
          if (err.code === 11000) {
            err = new Error('You already have a folder with that name');
            err.status = 400;
          }
          next(err);
        });

      User.findOneAndUpdate({ _id: user._id, 'questions.next':  oldCurrentNodeNext}, { $set: { 'questions.$.next' : currentHeadIndex} }, {new : true})
        .then(result => { 
          if (result) {
            User.findOneAndUpdate({ _id: user._id, 'questions.next': currentHeadIndex + 1 },{ $set: { 'questions.$.next' : oldCurrentNodeNext } }, {new : true})
              .then(result => {
                if (result) {
                  console.log('result after done', result);
                  // res.json(result);
                } else {
                  next();
                }
              })
              .catch(err => {
                if (err.code === 11000) {
                  err = new Error('You already have a folder with that name');
                  err.status = 400;
                }
                next(err);
              });
          } else {
            next();
          }
        })
        .catch(err => {
          if (err.code === 11000) {
            err = new Error('You already have a folder with that name');
            err.status = 400;
          }
          next(err);
        });


    })
    .catch(err => {
      next(err);
    });





  // not finished, need to have an M value
  const questionToPost = req.body.question;
  // linkedList.deleteFirst();
  // linkedList.insertLast(questionToPost);
  // posts the next one
  res.send('posted');
});


module.exports = router;
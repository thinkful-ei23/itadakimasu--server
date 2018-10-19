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
  console.log('here is answeredQuestion', answeredQuestion);
  const mToMove = answeredQuestion.memoryStr; // needs to change based on front end 
  const newHead = answeredQuestion.next;
  const userId = req.user.id;

  // for testing purposes
  // const seedUser = seedUsers[0];
  // const answeredQuestion = seedUser.questions[0]; // save the node that you just answered
  // const mToMove = 3; // needs to change based on front end 
  // const oldAnsweredQuestionNext = answeredQuestion.next;
  // console.log('old answered Question', oldAnsweredQuestionNext);
  // const userId = "5bc77c1d8253f12db8541151";
  
  User.findOne({_id: userId}) 
    .then(user => {
      const newQuestionsArr = user.questions;
      newQuestionsArr[user.head] = answeredQuestion;
      const currentHead = newQuestionsArr[user.head]; //save the value of the current head
      const currentHeadIndex = user.head;  //save the value of the current head's index

      let currentNode = currentHead;

      for (let i = currentHeadIndex; i < currentHeadIndex + mToMove; i++) {
        currentNode = newQuestionsArr[currentNode.next];
      }
      console.log(currentNode, 'currentNode after loop');
      // 0 1 2 3 4 5
      // new head is 1
      // index (currentNodeIndex)'s next should point to answeredNode's index
      // index (answeredNode'sIndex) should point to the old currentNodeIndex's next 
      const answeredNext = currentNode.next; 
      console.log('answeredNext: ', answeredNext);
      currentNode.next = currentHeadIndex; // set the current node's next to the answer node's index
      console.log('currentNode.next', currentNode.next);
      currentHead.next = answeredNext; // set the answer node's next to prior value of the current node's next
      console.log('currentHead.next', currentHead.next);

      console.log('New questions list: ', newQuestionsArr);

      console.log('newHead', newHead);
      //find the insertion point
      // change the head of the user
      return User.findOneAndUpdate({_id: userId}, {$set: {'head': newHead, 'questions': newQuestionsArr}}, {new : true});
    })
    .then(result => {
      if (result) {
        console.log('New user head: ', result.head);
        console.log('New user questions arr: ', result.questions);
        res.json(result);
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

});


module.exports = router;
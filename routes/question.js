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
  const oldAnsweredQuestionNext = answeredQuestion.next;
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
      const currentHead = user.questions[user.head]; //save the value of the current head
      const currentHeadIndex = user.head;  //save the value of the current head's index

      let currentNode = currentHead;

      for (let i = currentHeadIndex; i < mToMove; i++) {
        currentNode = user.questions[currentNode.next];
      }
      console.log('list of user questions', user.questions);
      console.log(currentNode, 'currentNode after loop');
      // 0 1 2 3 4 5
      // new head is 1
      // index (currentNodeIndex)'s next should point to answeredNode's index
      // index (answeredNode'sIndex) should point to the old currentNodeIndex's next 
      const newAnsweredNodeNext = currentNode.next; 
      console.log('newAnweredNodeNext', newAnsweredNodeNext);
      currentNode.next = currentHeadIndex; // set the current node's next to the answer node's index
      console.log('currentNode.next', currentNode.next);
      answeredQuestion.next = newAnsweredNodeNext; // set the answer node's next to prior value of the current node's next
      console.log('answeredQuestion.next', answeredQuestion.next);


      //change the current head to whoever answered node's next 
      const newHead = oldAnsweredQuestionNext;

      console.log('newHead',newHead);
      //find the insertion point
      // change the head of the user
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

      User.findOneAndUpdate({ _id: user._id, 'questions.next': newAnsweredNodeNext },{ $set: { 'questions.$.next' : currentHeadIndex } }, {new : true})
        .then(result => {
          if (result) {
            console.log('changing currentNode: should be pointing to 0', result);
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

      // need to change the answeredNode's next to equal
      console.log('searchning for the index that equals', oldAnsweredQuestionNext);
      User.findOneAndUpdate({ _id: user._id, 'questions.next': oldAnsweredQuestionNext }, { $set: { 'questions.$.next' : answeredQuestion.next } }, {new : true})
        .then(result => { 
          if (result) {
            console.log('changing answeredNode: should be pointing to 4', result);
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
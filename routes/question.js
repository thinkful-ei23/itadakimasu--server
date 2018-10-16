'use strict';
const express = require('express');
const router = express.Router();
const linkedList = require('../utils/LinkedList');

router.get('/', (req, res, next) => {
  // i need to know the user id
  // grab the array from their data
  // change that into a linkedlist?
  // show them the first item


  // returns the first LinkedList question
  const itemToReturn = linkedList.peek();
  console.log(linkedList);
  // for now the get endpoint is deleting the item
  // this needs to change to the post endpoint
  linkedList.deleteFirst();
  linkedList.insertLast(itemToReturn);
  res.json(itemToReturn);
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
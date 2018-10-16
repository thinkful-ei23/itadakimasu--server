'use strict';
const express = require('express');
const router = express.Router();
const linkedList = require('../utils/LinkedList');

router.get('/', (req, res, next) => {
  // returns the first LinkedList quesiton
  const itemToReturn = linkedList.peek();
  // for now the get endpoint is deleting the item
  linkedList.deleteFirst();
  console.log(itemToReturn.value);
  res.json(itemToReturn.value);
});

function deleteFirstItem () {

}

router.post('/question', (req, res, next) => {
  // posts the next one
  // 
});


module.exports = router;
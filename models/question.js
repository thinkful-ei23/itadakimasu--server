'use strict';
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  imageURL: String,
  question: String,
  answer: String,
  M : Number
});

questionSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Question', questionSchema);
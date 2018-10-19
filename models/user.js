'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  questions: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      imageDescription: String,
      imageURL: String,
      question: String,
      answer: String,
      memoryStr: Number,
      attempts : {type: Number, default: 0},
      successes : {type: Number, default: 0},
      next: Number
    }
  ],
  head: {
    type: Number,
    default: 0
  }
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);

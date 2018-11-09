const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  pagesRead: Number,
  pageCount: Number,
  publisher: String,
  href: String,
  googleBookId: String,
  userId: String,
  redeemed: Boolean,
  review: String,
  multiplier: Number,
  redeemedPoints: Number,
  imageLink: String,
  createdDt: String,
  redeemedDt: String,
  used: Boolean,
  usedDt: String,
  approved: Boolean,
  approvedDt: String
});

module.exports = mongoose.model('Book', bookSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionSchema = new Schema({
  title: String,
  userId: String,
  redeemed: Boolean,
  multiplier: Number,
  points: Number,
  redeemedPoints: Number,
  createdDt: String,
  redeemedDt: String,
  taskId: String,
  used: Boolean,
  usedDt: String
});

module.exports = mongoose.model('contribution', contributionSchema);
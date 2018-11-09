const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ageGroupSchema = new Schema({
  name: String,
  beginAge: Number,
  endAge: Number,
  createdDt: String
});

module.exports = mongoose.model('AgeGroup', ageGroupSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: String,
  points: Number,
  isActive: Boolean,
  createdById: String,
  createdDt: String,
  ageGroupId: String
});

module.exports = mongoose.model('Task', taskSchema);
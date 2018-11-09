const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  userName: String,
  roleName: String,
  bod: String,
  familyGroupId: String,
  createdDt: String
});

module.exports = mongoose.model('User', userSchema);
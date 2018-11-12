const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  userName: String,
  roleName: String,
  dob: String,
  familyGroupId: String,
  createdDt: String
});

module.exports = mongoose.model('User', userSchema);
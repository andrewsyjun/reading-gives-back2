const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyGroupSchema = new Schema({
  name: String,
  lastName: String,
  address: String,
  contactNumber: String,
  createdDt: String
});

module.exports = mongoose.model('FamilyGroup', familyGroupSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  id: ID,
  roleName: String
});

module.exports = mongoose.model('Role', roleSchema);
const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: String,
  email: String,
  membershipDate: Date,
});

module.exports = mongoose.model('Borrower', borrowerSchema);

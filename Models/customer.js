const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  role: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneno: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ConfirmPassword: {
    type: String,
  }

});

module.exports = mongoose.model('Customer', customerSchema);


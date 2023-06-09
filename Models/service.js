
const { fileLoader } = require('ejs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  vehicleno: {
    type: Number,
    required: true
  },
  phoneno: {
    type: Number,
    required: true
  },
  joindate: {
    type: String,
    required: true
  },
  leavedate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Service', userSchema);


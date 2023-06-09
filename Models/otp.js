const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
userId:{
    type: Schema.Types.ObjectId,
    ref: 'User'
},
    otp:{
      type: String,
      required: true 
    },
    created_at: { type: Date, default: Date.now, expires: 10 }
})

module.exports = mongoose.model('Otp', otpSchema);


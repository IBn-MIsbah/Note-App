const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require("mongoose-findorcreate")


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: String,
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});
userSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', userSchema);
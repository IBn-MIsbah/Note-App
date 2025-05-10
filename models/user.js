const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: function() { return !this.googleId; } },
  email: { type: String, unique: true, lowercase: true },
  googleId: { type: String, unique: true, sparse: true },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  errorMessage: { UserExistsError: "Email already registered" },
});
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);

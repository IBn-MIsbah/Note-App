import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, immutable: true },
});
userSchema.plugin(passportLocalMongoose)
export default mongoose.model("User", userSchema);
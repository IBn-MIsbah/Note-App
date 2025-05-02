import { name, email, password } from "ejs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  unique: true,
  password: String,
  cratedAt: { type: Date, default: Date.now, imutable: true },
});

export default mongoose.model("User", userSchema);

import { name, email, password } from 'ejs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true}, unique: true,
    password: String
})

export default mongoose.model("User", userSchema)
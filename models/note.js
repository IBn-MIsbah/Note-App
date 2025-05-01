import mongoose from 'mongoose';

const noteShema = new mongoose.Schema({
    title: String,
    content: String,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model("Note", noteShema)
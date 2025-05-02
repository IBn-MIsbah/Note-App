import mongoose from "mongoose";

const noteShema = new mongoose.Schema({
  title: String,
  content: String,
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cratedAt: { type: Date, default: Date.now, imutable: true },
  updatedAt: { type: Date, default: Date.now },
});
noteShema.pre("save", function (next) {
  this.updatedAt = Date.now;
});
export default mongoose.model("Note", noteShema);

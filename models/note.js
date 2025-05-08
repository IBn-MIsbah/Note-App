import mongoose from "mongoose";

const noteShema = new mongoose.Schema({
  title:{ type: String, required: true },
  content: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});
noteShema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next()
});
export default mongoose.model("Note", noteShema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "animes" }],
});

export const UserModel = mongoose.model("users", UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinDate: { type: String, required: true },
  watchList: [
    {
      animeID: { type: String, required: true },
      title: { type: String, required: true },
      image: { type: String },
      currentEpisodeNumber: { type: Number, required: true },
    },
  ],
});

export const UserModel = mongoose.model("users", UserSchema);

import mongoose from "mongoose";

const AnimeSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  animeID: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  currentEpisodeNumber: { type: Number },
});

export const AnimeModel = mongoose.model("animes", AnimeSchema);

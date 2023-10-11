import { Router } from "express";
import mongoose from "mongoose";
import { AnimeModel } from "../models/Anime.js";
import { UserModel } from "../models/Users.js";

const router = new Router();

// adding new anime records to the database
router.post("/", async (req, res) => {
  const anime = new AnimeModel(req.body);
  try {
    await anime.save();
    res.json({ isSuccess: true, message: "Anime added!" });
  } catch (error) {
    res.json(error);
  }
});

// adding an anime to a user's watchlist
router.put("/", async (req, res) => {
  try {
    const anime = await AnimeModel.findById(req.body.animeID);
    const user = await UserModel.findById(req.body.userID);
    user.watchList.push(anime);
    await user.save();
    res.json({ isSuccess: true, message: "Anime added!" });
  } catch (error) {
    res.json(error);
  }
});

// retrieve a list of anime from a user's watchlist.
router.get("/saved", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    const watchlist = await AnimeModel.find({
      _id: { $in: user.watchList },
    });
    res.json(watchlist);
  } catch (error) {
    res.json(error);
  }
});

// retrieve a list of anime(only objectIds) from a user's watchlist.
router.get("/saved/ids", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    res.json({ watchList: user?.watchList });
  } catch (error) {
    res.json(error);
  }
});

export { router as animesRouter };

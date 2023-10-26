import express from "express";
import { META } from "@consumet/extensions";
import { UserModel } from "../models/Users.js";

const router = express.Router();
const anilist = new META.Anilist();

/*-------------------------Retrieve the User's watchlist----------------------------------*/
router.get("/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ watchList: user?.watchList });
  } catch (error) {
    res.json(error);
  }
});

/*--------------------Retrieve the User's watchlist with its anime info------------------------*/
router.get("/infos/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const userWatchList = user?.watchList;

    if (!userWatchList || userWatchList.length === 0) {
      // Handle the case where userWatchList is empty or undefined
      return res.json([]);
    }

    const animeInfoPromises = userWatchList.map(async (item) => {
      return anilist.fetchAnimeInfo(item.animeID);
    });

    const animeList = await Promise.all(animeInfoPromises);
    res.json(animeList);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------------Add anime to User's watchlist----------------------------------*/
router.put("/add", async (req, res) => {
  const LIMIT = 10;
  const { userID, animeID, title, image, currentEpisodeNumber } = req.body;
  try {
    const user = await UserModel.findById(userID);

    // check if anime is already in the watchList
    const exists = user.watchList?.some((item) => item.animeID === animeID);
    if (exists) {
      return res.json({ message: "Anime already exists." });
    }

    // if watchList is greater than 10 it no longer add anime to watchlist
    if (user.watchList.length >= LIMIT) {
      return res.json({
        message: `Watchlist Limit Exceeded. Maximum ${LIMIT} anime allowed.`,
      });
    }

    // else it will be added to the watchlist
    user.watchList.push({ animeID, title, image, currentEpisodeNumber });
    await user.save();
    res.json({ message: "Anime added to your watchlist!" });
  } catch (error) {
    res.json(error);
  }
});

/*----------------Update current episode number to anime in User's watchlist--------------*/
router.put("/update", async (req, res) => {
  const { userID, animeID, currentEpisodeNumber } = req.body;
  try {
    const user = await UserModel.findById(userID);

    user.watchList.forEach((item) => {
      if (item.animeID === animeID) {
        item.currentEpisodeNumber = currentEpisodeNumber;
      }
    });

    await user.save();
    return res.json({ message: "Anime updated in your watchlist!" });
  } catch (error) {
    res.json(error);
  }
});

/*-------------------------Remove anime to User's watchlist----------------------------------*/
router.put("/remove", async (req, res) => {
  const { userID, animeID } = req.body;
  try {
    const user = await UserModel.findById(userID);

    // check if anime is already in the watchList
    const exists = user.watchList?.some((item) => item.animeID === animeID);

    if (exists) {
      // If the anime exists in the watchList, remove it
      user.watchList = user.watchList.filter(
        (item) => item.animeID !== animeID
      );
      await user.save();
      return res.json({ message: "Anime removed from your watchlist!" });
    }

    res.json({ message: "Anime not found in your watchlist." });
  } catch (error) {
    res.json(error);
  }
});

export { router as watchListRouter };

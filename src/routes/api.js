import express from "express";
import { META } from "@consumet/extensions";

const anilist = new META.Anilist();
const router = express.Router();

/*--------------------Get Trending Anime-----------------------*/
router.get("/trending", async (req, res) => {
  try {
    const data = await anilist.fetchTrendingAnime();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Error fetching data from the external API" });
  }
});

/*--------------------Get Recent Anime-----------------------*/
router.get("/recent", async (req, res) => {
  const provider = req.query.provider;
  const pageNumber = req.query.pageNumber;
  const itemsPerPage = req.query.itemsPerPage;

  try {
    const data = await anilist.fetchRecentEpisodes(
      provider,
      pageNumber,
      itemsPerPage
    );
    res.json(data);
  } catch (error) {
    console.log("Retrying...");
    try {
      const data = await anilist.advancedSearch(
        undefined,
        "ANIME",
        pageNumber,
        itemsPerPage,
        undefined,
        ["UPDATED_AT_DESC"],
        undefined,
        undefined,
        undefined,
        "RELEASING",
        undefined
      );
      data.retry = true;
      res.json(data);
      console.log("Retry successfull!");
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(500)
        .json({ error: "Error fetching data from the external API" });
    }
  }
});

/*------------Get Anime Info and Episode List using anime id param------------*/
router.get("/info", async (req, res) => {
  const id = req.query.id;
  try {
    const response = await anilist.fetchAnimeInfo(id);
    res.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Error fetching data from the external API" });
  }
});

/*--------------------Get Episode Url using episode id-----------------------*/
router.get("/episode", async (req, res) => {
  const episodeId = req.query.id;
  try {
    const data = await anilist.fetchEpisodeSources(episodeId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Error fetching data from the external API" });
  }
});

export { router as apiRouter };

import express from "express";
import cors from "cors";
import { META } from "@consumet/extensions";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT;
const anilist = new META.Anilist();

app.use(cors());

/*--------------------Get Trending Anime-----------------------*/
app.get("/api/trending", async (req, res) => {
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

/*--------------------Get Trending Anime-----------------------*/
app.get("/api/recent", async (req, res) => {
  try {
    const data = await anilist.fetchRecentEpisodes();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Error fetching data from the external API" });
  }
});

/*------------Get Anime Info and Episode List using anime id param------------*/
app.get("/api/info", async (req, res) => {
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
app.get("/api/episode", async (req, res) => {
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

app.use("/", (req, res) => {
  res.send("<p>Server is running!</p>");
});

app.listen(port, () => {
  console.log(`Server running in port ${port}...`);
});

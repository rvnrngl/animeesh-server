import express from "express";
import axios from "axios";
import cors from "cors";
import { META } from "@consumet/extensions";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT;
const url = process.env.URL;
const anilist = new META.Anilist();
console.log(url);

app.use(cors());

app.get("/keep-alive", (req, res) => {
  res.send("Successfully");
});

/*--------------------Keep server alive-----------------------*/
cron.schedule("*/14 * * * *", () => {
  axios
    .get(`${url}/keep-alive`)
    .then((response) => {
      console.log(`${response.data} pinged! Scheduled at ${new Date()}`);
    })
    .catch((error) => {
      console.error(`Error while pinging keep-alive endpoint: ${error}`);
    });
});

app.get("/", (req, res) => {
  res.send("Server running!🎉");
});

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

app.listen(port, () => {
  console.log(`Server running in port ${port}...`);
});

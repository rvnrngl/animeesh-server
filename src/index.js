import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import { META } from "@consumet/extensions";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT;
const URL = process.env.URL;

const app = express();
const anilist = new META.Anilist();

app.use(cors());

app.get("/", (req, res) => {
  // Read the contents of the HTML file
  fs.readFile("public/index.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Send the HTML content as the response
    res.send(data);
  });
  // res.send("Server running!🎉");
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

/*--------------------Get Recent Anime-----------------------*/
app.get("/api/recent", async (req, res) => {
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
    console.error("Error fetching data:", error);
    console.log("Retrying...");
    // try another approach if not working
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

/*---------------Schedule cron every 14 mins to keep server alive------------------*/
cron.schedule("*/14 * * * *", () => {
  axios
    .get(`${URL}/keep-alive`)
    .then((response) => {
      console.log(`${response.data} pinged! Scheduled at ${new Date()}`);
    })
    .catch((error) => {
      console.error(`Error while pinging keep-alive endpoint: ${error}`);
    });
});

app.get("/keep-alive", (req, res) => {
  res.send("Successfully");
});

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}...`);
});

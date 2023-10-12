import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: ".env.local" });

import { userRouter } from "./routes/users.js";
import { animesRouter } from "./routes/animes.js";
import { apiRouter } from "./routes/api.js";

const PORT = process.env.PORT;
const URL = process.env.URL;
const MONGP_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/api", apiRouter);
app.use("/watch-list", animesRouter);

mongoose.connect(
  `mongodb+srv://ravenprog17:${MONGP_DB_PASSWORD}@animeesh.aytni4o.mongodb.net/animeesh?retryWrites=true&w=majority`
);

app.get("/", (req, res) => {
  fs.readFile("public/index.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(data);
  });
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

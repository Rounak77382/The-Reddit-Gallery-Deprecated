const PORT = process.env.PORT || 3001;

import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";
import http from "http";
import * as socketIo from "socket.io";
import fs from "fs";
import { downloadImages } from "./downloader.js";
import listSubreddits from "./list_subreddits.js";
import crypto from "crypto";
import { Server } from "socket.io";
import snoowrap from "snoowrap";
import session from "express-session";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let currentDownloaderProcess;
let abortController = new AbortController();
let { signal } = abortController;
let userIsAuthorized = false;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let currentOperation;

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/subreddits/:name", async (req, res) => {
  // if (!req.session.r) {
  //   res.status(401).send("User is not authenticated");
  //   return;
  // }
  // const accessToken = req.session.r.accessToken;
  const subredditName = req.params.name;
  const subredditResults = await listSubreddits(subredditName);
  res.json(subredditResults);
});

// Generate a random state key
const state = crypto.randomBytes(16).toString("hex");

// Step 2: Redirect the user to Reddit's authorization page
app.get("/authorize", (req, res) => {
  let authUrl = snoowrap.getAuthUrl({
    clientId: process.env.praw_api_client_id,
    scope: ["read", "identity"],
    redirectUri: "http://localhost:3000/receive_code",
    permanent: true,
    state: state, // use the random state key
  });

  authUrl = authUrl.replace("www.reddit", "old.reddit");

  console.log("authUrl: ", authUrl);

  res.redirect(authUrl);
});

// Step 4: Receive the authorization code from Reddit
app.get("/receive_code", async (req, res) => {
  if (req.query.state !== state) {
    res.status(403).send("State does not match");
  } else {
    if (!req.query.code) {
      console.log("Authorization was not successful. No action taken.");
      res.status(401).send("Authorization was not successful");
      userIsAuthorized = false;
      io.emit("authorized", userIsAuthorized);
      return; // Return here to prevent further execution
    }

    const userCode = req.query.code;
    console.log("userCode: ", userCode);

    // Step 5: Exchange the authorization code for an access token
    const r = await snoowrap.fromAuthCode({
      code: userCode,
      userAgent: "testscript by RS_ted",
      clientId: process.env.praw_api_client_id,
      clientSecret: process.env.praw_api_client_secret,
      redirectUri: "http://localhost:3000/receive_code",
    });

    req.session.r = r; // Save r in the session
    res.send('<script>window.close(); window.location.href="/";</script>');
    io.emit("clearGallery");

    try {
      console.log("authorized > ", userIsAuthorized);
      let userdetails = await r.getMe();
      let name = userdetails.name;
      let dp = userdetails.icon_img;
      console.log("> r.getMe() : ");
      io.emit("username", name);
      io.emit("profilepicture", dp);
      userIsAuthorized = true;
      io.emit("authorized", userIsAuthorized);

      currentDownloaderProcess = downloadImages(
        "",
        "./public/media",
        10,
        "hot",
        "day",
        r,
        signal
      );

      for await (const image of currentDownloaderProcess) {
        io.emit("image", [image]);
        console.log(image);
      }
      io.emit("galleryUpdated");
    } catch (error) {
      console.error("Error downloading images:", error);
    }
  }
});

// Use the access token from the session in all subsequent requests
app.post("/download", async (req, res) => {
  // if (!req.session.r) {
  //   res.status(401).send("User is not authenticated");
  //   return;
  // }

  const r = req.session.r;
  console.log("> r : ", r);

  const subredditName = req.body.subredditName;
  console.log(`Downloading images from ${subredditName}...`);
  const postLimit = parseInt(req.body.postLimit);
  const outputDir = "./public/media"; // Set the output directory
  const postType = req.body.postType;
  const postTime = req.body.postTime;

  console.log(
    `Downloading ${postTime} ${postLimit} ${postType} posts from ${subredditName}...`
  );

  try {
    currentDownloaderProcess = downloadImages(
      subredditName,
      outputDir,
      postLimit,
      postType,
      postTime,
      r,
      signal
    );
    for await (const image of currentDownloaderProcess) {
      io.emit("image", [image]);
      console.log(image);
    }
    io.emit("galleryUpdated");
    res.status(200).send("Images downloaded successfully");
  } catch (error) {
    console.error("Error downloading images:", error);
    res.status(500).send("Error downloading images");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

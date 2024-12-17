
import snoowrap from "snoowrap";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const refreshTokenFilePath = path.join(__dirname, "refresh_token.txt");

async function getReadOnlyAccessToken() {
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.praw_api_client_id}:${process.env.praw_api_client_secret}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function getStoredRefreshToken() {
  if (fs.existsSync(refreshTokenFilePath)) {
    const token = fs.readFileSync(refreshTokenFilePath, "utf8");
    return token;
  }
  return null;
}

async function storeRefreshToken(token) {
  fs.writeFileSync(refreshTokenFilePath, token, "utf8");
}

async function validateToken(token) {
  try {
    const response = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function listSubreddits(subredditName) {
  let accessToken = await getStoredRefreshToken();

  if (!accessToken || !(await validateToken(accessToken))) {
    accessToken = await getReadOnlyAccessToken();
    await storeRefreshToken(accessToken);
  }

  const r = new snoowrap({
    userAgent: "testscript by RS_ted",
    clientId: process.env.praw_api_client_id,
    clientSecret: process.env.praw_api_client_secret,
    accessToken: accessToken,
  });

  const subredditResults = await r.searchSubredditNames(
    { query: subredditName },
    { includeNsfw: true }
  );
  return subredditResults;
}

export default listSubreddits;
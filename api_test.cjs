const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const rp = require("request-promise");
const fs = require("fs");

const app = express();
const port = 3000;

CLIENT_ID = process.env.praw_api_client_id;
CLIENT_SECRET = process.env.praw_api_client_secret;
USER_AGENT = "MyRedditApp/1.0.0 (by /u/RS_ted; for research purposes)";
REDIRECT_URI = "http://localhost:3000/reddit/callback";
REDDIT_USERNAME = process.env.praw_api_username;
REDDIT_PASSWORD = process.env.praw_api_password;

app.get("/reddit/callback", async (req, res) => {
  const options = {
    method: "POST",
    uri: "https://www.reddit.com/api/v1/access_token",
    auth: {
      user: CLIENT_ID,
      pass: CLIENT_SECRET,
    },
    formData: {
      grant_type: "password",
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
    },
    headers: {
      "User-Agent": USER_AGENT,
    },
    json: true,
  };

  try {
    const response = await rp(options);
    console.log(response);
    fs.writeFile("reddit_token.txt", response.access_token, (err) => {
      if (err) {
        console.error("Couldn't save token");
        throw new Error("Couldn't save token");
      } else {
        console.log("token saved");
      }
    });
    res.send("Logged in!");
  } catch (error) {
    console.error("Error", error);
    res.send(error);
    throw new Error("Error during Reddit callback");
  }
});

app.get("/auth/reddit", (req, res) => {
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=RANDOM&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=read submit`;
  res.redirect(authUrl);
});

// app.get("/reddit/callback", async (req, res) => {
//   const { code } = req.query;

//   const options = {
//     method: "POST",
//     uri: "https://www.reddit.com/api/v1/access_token",
//     auth: {
//       user: CLIENT_ID,
//       pass: CLIENT_SECRET,
//     },
//     formData: {
//       grant_type: "authorization_code",
//       code: code,
//       redirect_uri: REDIRECT_URI,
//     },
//     headers: {
//       "User-Agent": USER_AGENT,
//     },
//     json: true,
//   };

//   try {
//     const response = await rp(options);
//     console.log(response);
//     fs.writeFile("reddit_token.txt", response.access_token, (err) => {
//       if (err) {
//         console.error("Couldn't save token");
//         throw new Error("Couldn't save token");
//       } else {
//         console.log("token saved");
//       }
//     });
//     res.send("Logged in!");
//   } catch (error) {
//     console.error("Error", error);
//     throw new Error("Error during Reddit callback");
//   }
// });

app.get("/list", async (req, res) => {
  try {
    const token = fs.readFileSync("reddit_token.txt", "utf8");
    const options = {
      method: "GET",
      uri: "https://oauth.reddit.com/hot",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": USER_AGENT,
      },
      json: true,
    };
    const response = await rp(options);
    res.json(response);
  } catch (error) {
    console.error("Error", error);
    throw new Error("Error fetching Reddit list");
  }
});

app.get("/create-post", async (req, res) => {
  try {
    const token = fs.readFileSync("reddit_token.txt", "utf8");
    const options = {
      method: "POST",
      uri: "https://oauth.reddit.com/api/submit",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": USER_AGENT,
      },
      form: {
        api_type: "json",
        kind: "self",
        sr: "developer",
        title: "CodingWithAdo is the best youtube channel",
        text: "You should go and check: https://www.youtube.com/@codingwithado",
      },
      json: true,
    };
    const response = await rp(options);
    res.json(response);
  } catch (error) {
    console.error("Error", error);
    throw new Error("Error creating Reddit post");
  }
});

app.listen(port, () => {
  console.log("App is running");
});

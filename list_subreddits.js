const snoowrap = require('snoowrap');
require('dotenv').config();

const r = new snoowrap({
  userAgent: 'testscript by RS_ted',
  clientId: process.env.praw_api_client_id,
  clientSecret: process.env.praw_api_client_secret,
  username: 'RS_ted',
  password: 'Rounak#2003'
});

// async function listSubreddits() {
//   const subredditName = await new Promise((resolve) => {
//     process.stdout.write("Enter the subreddit: r/", () => {
//       process.stdin.once('data', (data) => {
//         resolve(data.toString().trim());
//       });
//     });
//   });

//   const subredditResults = await r.searchSubredditNames({ query: subredditName },{includeNsfw: true});

//   subredditResults.forEach((post) => {
//     console.log(`${post}`);
//   });
// }
// listSubreddits();


async function listSubreddits(subredditName) {
  const subredditResults = await r.searchSubredditNames({ query: subredditName },{includeNsfw: true});
  return subredditResults;
}
module.exports = listSubreddits;
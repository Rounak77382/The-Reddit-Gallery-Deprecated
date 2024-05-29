import snoowrap from 'snoowrap';
import dotenv from 'dotenv';
dotenv.config();

const r = new snoowrap({
  userAgent: 'testscript by RS_ted',
  clientId: process.env.praw_api_client_id,
  clientSecret: process.env.praw_api_client_secret,
  username: 'RS_ted',
  password: 'Rounak#2003'
});

async function listSubreddits(subredditName) {
  const subredditResults = await r.searchSubredditNames({ query: subredditName },{includeNsfw: true});
  return subredditResults;
}

export default listSubreddits;
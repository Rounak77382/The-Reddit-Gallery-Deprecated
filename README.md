# Reddit Downloader Node.js

This is a Node.js application that allows users to preview media files from specified subreddits in a gallery.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- Python
- PRAW (Python Reddit API Wrapper)

### Installing

1. Clone the repository
```sh
git clone https://github.com/yourusername/redditdownloader_nodejs.git
```
2. Install Python packages

```sh
pip install -r requirements.txt
```

3. Install NPM packages
```sh
npm install
```
4. start the server
```sh
npm start
```
The server runs on port 3000 by default.

## Usage

This application uses PRAW to interact with Reddit's API. You'll need to set up a Reddit application to get the client_id and client_secret needed for PRAW. You can do this at https://www.reddit.com/prefs/apps.

Once you have these, you can set them in your environment variables:

```sh
export praw_api_client_id=your_client_id
export praw_api_client_secret=your_client_secret
```

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## Built With

- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [snoowrap](https://www.npmjs.com/package/snoowrap)

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.



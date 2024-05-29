# Reddit Gallery Viewer

Welcome to the Reddit Gallery Viewer project! This is a powerful tool built with Node.js that allows you to quickly and efficiently view media from various subreddits. The application is designed with the purpose of keeping information intact and easily accessible. As a secondary feature, it also allows you to download the media for offline viewing.

## Features

- **Download media from any subreddit**: Just enter the subreddit name and the tool will fetch the media for you. The downloaded files will be stored in the `/public/media` directory in your project folder.
- **Filter posts by time**: You can choose to download media from posts made Today, This Week, This Month, This Year, or All time.
- **Filter posts by type**: Choose whether you want to download media from the Top, New, Hot, or Rising posts.
- **Set a limit on the number of posts to download**: You can set a limit on the number of posts from which to download media.

## Installation

1. **Clone this repository**: Use the command `git clone https://github.com/Rounak77382/The-Reddit-Gallery.git` to clone this repository to your local machine.
2. **Install the dependencies**: Navigate to the project directory and run `npm install` to install all the necessary dependencies.

## Usage

1. **Start the server**: Run `npm start` to start the server. The application will automatically open in your default web browser.
2. **Enter the subreddit name**: Type in the name of the subreddit from which you want to download media.
3. **Select the post time and type**: Choose the time period and type of posts from which to download media.
4. **Set the post limit**: Enter the maximum number of posts from which to download media.
5. **Start downloading**: Click the search button to start downloading media.

## Login Feature

This application also includes a login feature for users who want to save their preferences or have a personalized experience. Here's how you can use it:

1. **Navigate to the login page**: Click on the 'Login' button on the top right corner of the homepage.
2. **Enter your credentials**: If you already have an account, enter your username and password and click 'Login'. If you don't have an account, click on 'Sign Up' to create a new one.
3. **Sign Up**: Enter your desired username, a valid email address, and a strong password. Click 'Sign Up' to create your account.
4. **Verify your email**: A verification link will be sent to your email. Click on the link to verify your account.
5. **Login**: Once your account is verified, you can login with your username and password.

Remember, your password is encrypted and stored securely. We do not have access to your password and cannot retrieve it for you. If you forget your password, you will have to reset it.

## Dependencies

This project uses the following dependencies:

- axios: Promise based HTTP client for the browser and node.js
- body-parser: Node.js body parsing middleware
- date-fns: Modern JavaScript date utility library
- date-fns-tz: Comprehensive, yet simple, parsing and formatting for JavaScript Dates
- dotenv: Loads environment variables from .env for nodejs projects
- esm: Tomorrow's ECMAScript modules today!
- express: Fast, unopinionated, minimalist web framework for node
- express-session: Simple session middleware for Express
- open: Open stuff like URLs, files, executables
- ora: Elegant terminal spinner
- redgif: A simple API wrapper for Redgifs
- snoowrap: A fully-featured JavaScript wrapper for the reddit API
- socket.io: Realtime application framework (Node.JS server)


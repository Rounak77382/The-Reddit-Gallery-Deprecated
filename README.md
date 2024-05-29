# Reddit Gallery Viewer

Welcome to the Reddit Gallery Viewer project! This is a powerful tool built with Node.js that allows you to quickly and efficiently view media from various subreddits. The application is designed to keep information intact and easily accessible. Additionally, it allows you to download the media for offline viewing.

## Features

- **Download Media from Any Subreddit**: Enter the subreddit name, and the tool will fetch and download the media for you. The downloaded files will be stored in the `/public/media` directory.
- **Filter Posts by Time**: Download media from posts made Today, This Week, This Month, This Year, or All Time.
- **Filter Posts by Type**: Choose to download media from the Top, New, Hot, or Rising posts.
- **Set a Limit on the Number of Posts**: Specify the maximum number of posts to download media from.

## Installation

1. **Clone the Repository**: Use the following command to clone the repository to your local machine:
    ```bash
    git clone https://github.com/Rounak77382/The-Reddit-Gallery.git
    ```
2. **Install Dependencies**: Navigate to the project directory and run this command to install all necessary dependencies:
    ```bash
    cd The-Reddit-Gallery
    npm install
    ```

## Usage

1. **Start the Server**: To start the server, run:
    ```bash
    npm start
    ```
    The application will automatically open in your default web browser.

2. **Enter Subreddit Name**: Type in the name of the subreddit from which you want to download media.
3. **Select Post Time and Type**: Choose the time period and type of posts to download media from.
4. **Set Post Limit**: Enter the maximum number of posts to download media from.
5. **Start Downloading**: Click the search button to start downloading media.

## Login Feature

The application includes a login feature for users who want to save their preferences or have a personalized experience.

### How to Use the Login Feature

1. **Navigate to the Login Page**: Click on the 'Login' button at the top right corner of the homepage.
2. **Enter Your Credentials**: If you have an account, enter your username and password and click 'Login'. If you don't have an account, click 'Sign Up' to create one.
3. **Sign Up**: Provide a desired username, a valid email address, and a strong password. Click 'Sign Up' to create your account.
4. **Verify Your Email**: A verification link will be sent to your email. Click the link to verify your account.
5. **Login**: Once your account is verified, log in with your username and password.

> **Note**: Your password is encrypted and stored securely. We do not have access to your password and cannot retrieve it. If you forget your password, you will need to reset it.

## Dependencies

The project uses the following dependencies:

- **axios**: Promise-based HTTP client for the browser and Node.js
- **body-parser**: Node.js body parsing middleware
- **date-fns**: Modern JavaScript date utility library
- **date-fns-tz**: Comprehensive parsing and formatting for JavaScript Dates
- **dotenv**: Loads environment variables from .env for Node.js projects
- **esm**: Tomorrow's ECMAScript modules today
- **express**: Fast, unopinionated, minimalist web framework for Node.js
- **express-session**: Simple session middleware for Express
- **open**: Open URLs, files, executables, etc.
- **ora**: Elegant terminal spinner
- **redgif**: Simple API wrapper for Redgifs
- **snoowrap**: Fully-featured JavaScript wrapper for the Reddit API
- **socket.io**: Real-time application framework (Node.js server)

## Conclusion

With these features and instructions, you are ready to set up and use the Reddit Gallery Viewer to download and view media from your favorite subreddits. Enjoy exploring and downloading content with ease!
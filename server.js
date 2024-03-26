const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let pythonProcess = null;


// app.get('/subreddits', (req, res) => {
//   fs.readFile('subreddits.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Failed to read file:', err);
//       res.status(500).send('Server error');
//       return;
//     }
//     res.send(data.split('\n'));
//   });
// });

const listSubreddits = require('./list_subreddits.js');

app.get('/subreddits/:name', async (req, res) => {
    const subredditName = req.params.name;
    const subredditResults = await listSubreddits(subredditName);
    res.json(subredditResults);
});

// API endpoint for downloading images
app.post('/download', (req, res) => {

    if (pythonProcess) {
        pythonProcess.kill();
    }

    const subredditName = req.body.subredditName;
    console.log(`Downloading images from ${subredditName}...`);
    const postLimit = req.body.postLimit;
    const outputDir = './public/media'; // Set the output directory
    const postType = req.body.postType;
    const postTime = req.body.postTime;

    console.log(`Downloading ${postTime} ${postLimit} ${postType} posts from ${subredditName}...`);

    pythonProcess = spawn('python', ['-u','./downloader.py', subredditName, outputDir, postLimit, postType, postTime]);

    pythonProcess.stdout.on('data', (data) => {
        io.emit('pythonProcessStarted');
        const lines = data.toString().trim().split('\n'); // Trim whitespace and split by newline
        lines.forEach(line => {
            if (line.startsWith('[{"url"')){
                try {
                    console.log(line);
                    const imageData = JSON.parse(line);
                    
                    io.emit('image', imageData); // Emit the image data to the client
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
        }});
    });

    let errorSent = false;

pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
    if (!errorSent) {
        res.status(500).send('Error downloading images');
        errorSent = true;
    }
});

pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        io.emit('pythonProcessClosed');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

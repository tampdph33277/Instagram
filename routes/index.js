const express = require('express');
const router = express.Router();
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

app.use(express.json()); // Parse incoming JSON data

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve the HTML file
});

router.get('/download-instagram-image', async (req, res) => {
    const instagramUrl = req.query.url;
    // ... rest of your code ...



    const options = {
        method: 'POST',
        url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual key
            'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
        },
        data: {
            url: instagramUrl
        }
    };

    try {
        const response = await axios.request(options);
        const mediaUrl = response.data.mediaUrl;

        if (!mediaUrl) {
            return res.status(400).json({ error: 'No media URL found in response' });
        }

        // Implement logic to download the media (image or video) from mediaUrl
        // You can use libraries like 'fs' or external services for downloading
        // ... your download logic ...

        // Replace with a placeholder response until you implement download logic
        res.json({ message: 'Media URL retrieved successfully!', mediaUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

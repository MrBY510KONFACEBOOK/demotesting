// facebook.js
const axios = require('axios');

async function extractLinks(decodedData) {
    if (decodedData && decodedData.links) {
        const links = decodedData.links;

        // Extracting each key-value pair in Links and formatting them
        const formattedLinks = Object.entries(links).map(([key, value]) => {
            return `${key}: ${value}`;
        });

        // Joining the formatted links with a comma separator
        const joinedLinks = formattedLinks.join(', ');

        return joinedLinks;
    }

    return null;
}

async function getFacebookInfo(message, args) {
    if (args.length < 2) {
        message.reply('Usage: !facebook <facebook-video-url>');
    } else {
        const videoUrl = args[1];

        const options = {
            method: 'GET',
            url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',
            params: { url: videoUrl },
            headers: {
                'X-RapidAPI-Key': '668a212841msh677fe3c23974d58p1f3bccjsn8734806d7d63',
                'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;

            // Extract and format links directly
            const formattedLinks = await extractLinks(responseData);

            if (formattedLinks) {
                // Sending the formatted links to the user
                message.reply(`Extracted Links: ${formattedLinks}`);
            } else {
                message.reply('Failed to extract links from the Facebook response.');
            }

        } catch (error) {
            console.error(error);
            message.reply('An error occurred while processing the Facebook video link.');
        }
    }
}

module.exports = getFacebookInfo;

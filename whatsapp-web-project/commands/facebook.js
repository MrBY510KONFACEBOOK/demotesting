const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

async function extractLinks(decodedData) {
    if (decodedData && decodedData.links) {
        const links = decodedData.links;

        // Extracting each value in Links
        const values = Object.values(links);

        // Joining the values with a comma separator
        const joinedValues = values.join(', ');

        return joinedValues;
    }

    return null;
}

async function getFacebookInfo(message, args, chat) {
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

            const formattedLinks = await extractLinks(responseData);

            if (formattedLinks) {
                message.reply(`Extracted Links: ${formattedLinks}`);

                // Extracting each value in Links
                const values = Object.values(responseData.links);

                // Loop through values
                for (const value of values) {
                    // Sending the media directly using the URL
                    chat.sendMessage(value, { url: true });
                }

                message.reply('Media sent successfully.');
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

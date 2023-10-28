// facebook.js
const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

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

            const links = extractLinks(responseData);
            if (links) {
                for (const [key, value] of links) {
                    // Send media from URL
                    const media = await MessageMedia.fromUrl(value);
                    await message.reply(`Key: ${key}, Value: ${value}`, media);
                }
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

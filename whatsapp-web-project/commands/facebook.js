const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

async function extractLinks(decodedData) {
    if (decodedData && decodedData.links) {
        const links = decodedData.links;
        const values = Object.values(links);
        const joinedValues = values.join(', ');

        return joinedValues;
    }

    return null;
}

async function downloadMedia(url) {
    const response = await axios.get("$url", { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

async function getFacebookInfo(message, args, chat, options) {
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
                message.reply('Downloading and sending media...');

                const mediaBuffer = await downloadMedia(formattedLinks);

                // Save media to a local file
                const mediaFilePath = 'downloads/file.mp4';
                fs.writeFileSync(mediaFilePath, mediaBuffer);

                // Send media using whatsapp-web.js
                const media = MessageMedia.fromFilePath(mediaFilePath);

                // Send media to recipient
                chat.sendMessage(media);

                // Delete the local media file
                fs.unlinkSync(mediaFilePath);
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

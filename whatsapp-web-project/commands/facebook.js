const axios = require('axios');
const fs = require('fs').promises;
const { MessageMedia } = require('whatsapp-web.js');

async function downloadMedia(url, localPath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await fs.writeFile(localPath, Buffer.from(response.data));
        return localPath;
    } catch (error) {
        console.error('Error downloading media:', error);
        return null;
    }
}

// Add the extractLinks function at the bottom of the file
function extractLinks(decodedData) {
    if (decodedData && decodedData.links) {
        const links = decodedData.links;
        return Object.entries(links);
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

            const links = extractLinks(responseData);
            if (links) {
                for (const [key, value] of links) {
                    // Download and send media for each link
                    const localPath = await downloadMedia(value, `./media/${key}.mp4`);
                    if (localPath) {
                        const media = MessageMedia.fromFilePath(localPath);
                        await message.reply(`Key: ${key}, Value: ${value}`, media);
                    } else {
                        console.error('Failed to download media from link:', value);
                    }
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

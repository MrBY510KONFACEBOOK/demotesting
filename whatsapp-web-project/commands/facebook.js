const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

// وظيفة لاستخراج الروابط
async function extractLinks(decodedData) {
    if (decodedData && decodedData.links) {
        const links = decodedData.links;

        // استخراج القيم (الروابط) من الروابط
        const values = Object.values(links);

        // دمج القيم بفاصلة
        const joinedValues = values.join(', ');

        return joinedValues;
    }

    return null;
}

// وظيفة للحصول على معلومات Facebook
async function getFacebookInfo(message, args, chat) {
    if (args.length < 2) {
        message.reply('Usage: !facebook <facebook-video-url>');
    } else {
        const videoUrl = args[1];

        // إعداد خيارات الطلب
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
            // إرسال طلب إلى API
            const response = await axios.request(options);
            const responseData = response.data;

            // استخراج وتنسيق الروابط مباشرة
            const formattedLinks = await extractLinks(responseData);

            if (formattedLinks) {
                // إرسال الروابط المنسقة إلى المستخدم
                message.reply(`Extracted Links: ${formattedLinks}`);

                // استخراج القيم (الروابط) من الروابط
                const values = Object.values(responseData.links);

                // حلقة عبر القيم
                for (const value of values) {
                    // إنشاء وسائط من الرابط وإرسالها
                    const media = await MessageMedia.fromUrl(value);
                    chat.sendMessage(media);
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

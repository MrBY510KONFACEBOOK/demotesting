// translate.js
const translate = require('translate-google');

async function translateText(message, args) {
    if (args.length < 3) {
        message.reply('Usage: !tr <target-language> <text>');
    } else {
        const targetLanguage = args[1];
        const textToTranslate = args.slice(2).join(' ');

        try {
            const translation = await translate(textToTranslate, { to: targetLanguage });
            message.reply(`Translation: ${translation}`);
        } catch (error) {
            message.reply('An error occurred during translation.');
        }
    }
}

module.exports = translateText;

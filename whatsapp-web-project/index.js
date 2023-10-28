const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const translateCommand = require('./commands/translate');
const facebookCommand = require('./commands/facebook');
const helpCommand = require('./commands/help');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    const args = message.body.split(' ');

    switch (args[0]) {
        case '!tr':
            translateCommand(message, args);
            break;

        case '!facebook':
            facebookCommand(message, args);
            break;

        case '!help':
            helpCommand(message);
            break;

        default:
            message.reply(`Hello! My name is Abdellah.\nType !help for a list of available commands.`);
            break;
    }
});

client.initialize();

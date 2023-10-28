// help.js
function displayHelp(message) {
    const helpMessage = `
        Hello! My name is Abdellah. Here's a list of available commands:
        - !tr <target-language> <text>: Translate text to the specified language.
        - !facebook <facebook-video-url>: Get information about a Facebook video.
        ... Other commands ...
    `;
    message.reply(helpMessage);
}

module.exports = displayHelp;

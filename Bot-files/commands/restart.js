const { EmbedBuilder } = require('discord.js');
const emojis = require('../emoji.json');
const config = require('../config.json'); // Import config.json

// Utility function to create a delay
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function restartCommand(message) {
    try {
        // Check if the user is whitelisted
        if (!config.whitelist.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF4E4E')
                        .setDescription(`## ${emojis['cross']} You are not authorized to use this command.\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Only whitelisted members can execute this action. Please contact an administrator if you believe this is an error.\nㅤㅤㅤㅤㅤㅤㅤ\n`)
                        .setFooter({ text: 'Access Denied', iconURL: message.client.user.displayAvatarURL() })
                        .setTimestamp(),
                ],
            });
        }

        // Send an embed indicating the bot is restarting
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#FFD431')
                    .setDescription(`## ${emojis['down']} Invoice Generator Bot Restarting.\n\nㅤㅤㅤㅤㅤㅤㅤ\n> The bot is currently undergoing a quick restart to improve performance and stability. It will be back online shortly! Thank you for your patience.\nㅤㅤㅤㅤㅤㅤㅤ\n`)
                    .setFooter({ text: 'Bot Restarting', iconURL: message.client.user.displayAvatarURL() })
                    .setTimestamp(),
            ],
        });

        // Add a 5-second delay
        await delay(2000);

        // Gracefully shutdown the bot
        await message.client.destroy();

        // Exit the process (this will allow your process manager to restart the bot)
        process.exit(0);
    } catch (error) {
        console.error(error);
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#FF4E4E')
                    .setDescription(`## ${emojis['cross']} Failed to restart the bot.\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Please try again later or check the logs for more details.\nㅤㅤㅤㅤㅤㅤㅤ\n`)
                    .setFooter({ text: 'Error detected while restarting', iconURL: message.client.user.displayAvatarURL() })
                    .setTimestamp(),
            ],
        });
    }
}

module.exports = { restartCommand };

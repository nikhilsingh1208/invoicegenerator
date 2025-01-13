// commands/ping.js
const { EmbedBuilder } = require('discord.js');
const https = require('https');
const emojis = require('../emoji.json');

async function pingCommand(message) {
    try {
        const startTime = Date.now();
        const botPing = message.client.ws.ping;
        const msg = await message.channel.send('Bot Successfully Pinged...');
        const messageLatency = Date.now() - startTime;
        
        // Make a quick API request to test Invoice API latency (you can use any endpoint)
        https.get('https://invoice-generator.com', (res) => {
            const apiPing = Date.now() - startTime; // Latency for Invoice API
			msg.edit({
            	embeds: [
                    new EmbedBuilder()
                        .setColor('#63FF31')
                    	.setThumbnail('https://cdn-icons-png.flaticon.com/512/3039/3039368.png')
                        .setDescription(
                            `## ${emojis['ping']} Latency Overview!\n\n\nㅤㅤㅤㅤㅤㅤㅤ\n` +
                			`> ${emojis['latency']} API Latency: ${botPing}ms\n` +
                			`> ${emojis['latency']} Message Latency: ${messageLatency}ms\n` +
                			`> ${emojis['latency']} Invoice Generator Latency: ${apiPing}ms\nㅤㅤㅤㅤㅤㅤㅤ`)
						.setFooter({ text: 'Bot Ping Report Generated', iconURL: message.client.user.displayAvatarURL() })
    					.setTimestamp()
            	],
        	});


       });
    } catch (error) {
        console.error(error);
        message.channel.send({ embeds: [new EmbedBuilder().setColor(0xFF0000).setTitle('Error').setDescription('Failed to fetch ping information.')] });
    }
}

module.exports = { pingCommand };

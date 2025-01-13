// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_TOKEN, BOT_VERSION } = require('./config.json');
const eventHandler = require('./handlers/eventHandler');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // For colored and styled console output

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Register events
client.once('ready', () => {
    const readyEvent = require('./events/ready');
    readyEvent(client);
});

// Listen for the messageCreate event
client.on('messageCreate', (message) => eventHandler.messageCreate(client, message));

client.login(DISCORD_TOKEN);

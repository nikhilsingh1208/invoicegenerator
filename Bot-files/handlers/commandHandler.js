// handlers/eventHandler.js
const { messageCreate } = require('../events/messageCreate');

module.exports = {
    messageCreate: (client, message) => messageCreate(client, message),  // Correctly call the messageCreate handler
};

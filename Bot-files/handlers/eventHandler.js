// handlers/eventHandler.js

// Import the messageCreate function
const { messageCreate } = require('../events/messageCreate');

// Export the messageCreate handler correctly
module.exports = {
    messageCreate, // This will export messageCreate directly
};

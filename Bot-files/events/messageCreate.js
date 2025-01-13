// events/messageCreate.js

// Ensure you're exporting the messageCreate function
module.exports.messageCreate = async (client, message) => {
    if (!message) {
        console.error('No message received');
        return;
    }

	const invoiceCommands = ['!generateinvoice', '!gi', '!invoice'];
	if (invoiceCommands.includes(message.content.toLowerCase())) {
    	const { generateInvoiceCommand } = require('../commands/generateInvoice');
    	generateInvoiceCommand(message);
	}

	const pingCommands = ['!p', '!P', '!ping', '!PING','p'];
	if (pingCommands.includes(message.content.toLowerCase())) {
        const { pingCommand } = require('../commands/ping');
        pingCommand(message);
    }

    const restartCommands = ['!restart', '!reboot','!r','r'];
    if (restartCommands.includes(message.content.toLowerCase())) {
        const { restartCommand } = require('../commands/restart');
        restartCommand(message);
    }

};

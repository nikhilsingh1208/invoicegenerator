const chalk = require('chalk'); // For colored and styled console output
const fs = require('fs');
const path = require('path');
const displayOwnerInfo = require('../utils/owner');

function getMemoryUsage() {
    const used = process.memoryUsage();
    return `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`;
}

module.exports = (client) => {
    console.clear();

    console.log(chalk.bold.blueBright('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
    console.log(chalk.bold.blueBright('┃ ') + chalk.bold.white('🤖\t BOT INITIALIZATION COMPLETE') + chalk.bold.blueBright('\tㅤ   ㅤ ㅤ ㅤ ┃'));
    console.log(chalk.bold.blueBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));

    console.log(chalk.bold.green('📅 \tBot Name:        ') + chalk.cyanBright(client.user.tag));
    console.log(chalk.bold.green('🔧 \tBot Id:          ') + chalk.cyanBright(client.user.id));
    console.log(chalk.bold.green('🌍 \tTotal Servers:   ') + chalk.magentaBright(client.guilds.cache.size));
    console.log(chalk.bold.green('👥 \tTotal Users:     ') + chalk.magentaBright(client.users.cache.size));
    console.log(chalk.bold.green('💬 \tTotal Channels:  ') + chalk.magentaBright(client.channels.cache.size));
    console.log(chalk.bold.green('💻 \tNode.js Version: ') + chalk.yellow(process.version));
    console.log(chalk.bold.green('🔋 \tMemory Usage:    ') + chalk.yellow(getMemoryUsage()));

    console.log(chalk.bold.blueBright('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
    console.log(chalk.bold.blueBright('┃ ') + chalk.bold.white('🤖\t COMMANDS LOADED') + chalk.bold.blueBright('\tㅤ   ㅤ         ㅤ ㅤ ┃'));
    console.log(chalk.bold.blueBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));


    const commandFiles = fs
        .readdirSync(path.join(__dirname, '../commands'))
        .filter(file => file.endsWith('.js'))
        .map(file => file.replace('.js', ''));

    commandFiles.forEach((command, index) => {
        console.log(chalk.bold.yellow(`${index + 1}. ${command}`));
    });

    console.log(chalk.bold.blueBright('\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
    console.log(chalk.bold.blueBright('┃ ') + chalk.bold.greenBright('🚀\t BOT IS READY TO USE NOW') + chalk.bold.blueBright('\tㅤ ㅤ  ㅤ ㅤㅤ┃'));
    console.log(chalk.bold.blueBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
    console.log(chalk.bold.blueBright('\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
    console.log(chalk.bold.blueBright('┃ ') + chalk.bold.white('💚\t THANKS FOR USING MY BOT') + chalk.bold.blueBright('\tㅤ ㅤ  ㅤ ㅤㅤ┃'));
    console.log(chalk.bold.blueBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
    console.log(chalk.bold.blueBright('\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
	displayOwnerInfo();
    console.log(chalk.bold.blueBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
};

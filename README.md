# Invoice Generator Bot

## Overview  
The Invoice Generator Bot is a powerful and user-friendly Discord bot designed to help businesses and individuals create professional invoices effortlessly. With just a few commands, users can generate invoices, customize details, and send them via email—all within Discord.  

## Features  
- **Easy Invoice Creation**: Quickly generate professional invoices using a simple command.  
- **Customizable Options**: Input client information, invoice details, and more via intuitive dropdowns and forms.  
- **Email Integration**: Automatically send generated invoices to clients.  
- **User-Friendly Interface**: Clean and straightforward commands for an efficient experience.  

## Requirements  
- Node.js (latest stable version)  
- Discord.js library  
- An API key for [Invoice Generator](https://invoice-generator.com)  
- Email service credentials (for email integration)  

## Fresh Installation  
   ```  
   sudo apt update && mkdir invoice-generator && cd invoice-generator && sudo apt install -y git nodejs && git clone https://github.com/nikhilsingh1208/invoicegenerator.git && cd Bot-files/ && npm install  moment-timezone==0.5.46 discord.js==14.16.3 nodemailer==6.9.16 chalk==4.1.2
   ```  

## Configuration and Customization Guide

1. config.json
   Update this file to suit your needs. Configure your bot token, API key, default channel ID, SMTP details, and invoice settings as required.  

2. emoji.json
   Upload the emojis from the `emoji` folder to your Discord bot. Copy each emoji’s ID and update the corresponding entries in this JSON file.  

3. Adding New Commands
   You can add new commands by following the structure of the `ping` command.  

4. Requesting New Features
   Have ideas or need additional features? Submit your suggestions in the **Issues** section, and we’ll consider them for future updates.  

## Usage  
1. Start the bot:  
   ``` 
   node index.js  
   ```  
2. Use the `!gi` command to create an invoice. Follow the prompts to input client and invoice details.  
3. The bot will generate the invoice and send it via email if configured.  

## Contributing  
Contributions are welcome! Feel free to open issues, suggest improvements, or submit pull requests.  

## License  
This project is licensed under the [MIT License](LICENSE).  

## Support  
If you encounter any issues or have questions, contact us on our Discord server [click here](https://discord.gg/5MjRxuehdS).  

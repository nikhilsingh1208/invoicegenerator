const { EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { generateInvoice } = require('../utils/invoiceUtils');
const { INVOICE_API_KEY, defaultChannel, SMTP_CONFIG, whitelist, INVOICESETTINGS } = require('../config.json');
const nodemailer = require('nodemailer'); // Import nodemailer
const emojis = require('../emoji.json');

function createEmbed(color, description, message) {
    return new EmbedBuilder()
        .setColor(color)
        .setDescription(description)
        .setFooter({ text: 'Error Detected While Processing' })
        .setTimestamp()
}
function createEmbedinvoice(color, description, message) {
    return new EmbedBuilder()
        .setColor(color)
        .setDescription(description)
        .setFooter({ text: 'Invoice Generator' })
        .setTimestamp()
}
async function askQuestion(message, question) {
    await message.channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(question)
                .setFooter({ text: 'Invoice Generator', iconURL: message.client.user.displayAvatarURL() })
                .setTimestamp(),
        ],
    });

    const filter = (m) => m.author.id === message.author.id;
    const response = await message.channel.awaitMessages({ filter, max: 1, time: 60000 });
    const content = response?.first()?.content;

    if (!content) {
        await message.channel.send({
            embeds: [createEmbed(0xFF0000, `## ${emojis['cross']} No response received.\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Please try again later or check the logs for more details.\nㅤㅤㅤㅤㅤㅤㅤ\n`, message)],
        });
        throw new Error('No response received.');
    }

    return content;
}

// Function to send email
async function sendEmail(to, filePath, clientName, invoiceNumber, date, dueDate, paidAmount, paymentStatus) {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: SMTP_CONFIG.secure,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
        });

        const mailOptions = {
            from: '"Your Company" <youremail@example.com>',
            to,
            subject: `Your Invoice from ${INVOICESETTINGS.from}`,
            text: `Dear ${clientName},\n\nI hope this message finds you well.\n\nPlease find attached your invoice for our services rendered. Below are the details for your reference:\n\nInvoice Number: ${invoiceNumber}\nInvoice Date: ${date}\nDue Date: ${dueDate}\nStatus: ${paymentStatus}\nAmount Paid: ${paidAmount}\n\nIf you have any questions or require further assistance regarding this invoice, please feel free to reach out to us at ${INVOICESETTINGS.emailid}. We appreciate your prompt attention to this matter. We look forward to serving you again.\n\nBest regards,\n${INVOICESETTINGS.from}\n`,
            attachments: [{ path: filePath }],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error(`Failed to send email: ${error.message}`);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

// Main function to handle invoice generation
async function generateInvoiceCommand(message) {
    if (!whitelist.includes(message.author.id)) {
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
    try {
        const clientName = await askQuestion(message, `## ${emojis['client']} Step 1: Client Name.\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Please enter the name of the client for this invoice.\nㅤㅤㅤㅤㅤㅤㅤ\n`);
        const invoiceNumber = await askQuestion(message, `## ${emojis['invoice']} Step 2: Invoice Number\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the unique invoice number associated with this transaction.\nㅤㅤㅤㅤㅤㅤㅤ\n`);
        const paymentStatus = await askQuestion(message, `## ${emojis['payment_status']} Step 3: Payment Status\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the payment status (Paid/Unpaid)\nㅤㅤㅤㅤㅤㅤㅤ\n`);

        let itemCount = 0;
        do {
                const itemCountResponse = await askQuestion(message, `## ${emojis['item']} Step 4: Item Count\n\nㅤㅤㅤㅤㅤㅤㅤ\n> How many items do you want to add?\nㅤㅤㅤㅤㅤㅤㅤ\n`);
            itemCount = parseInt(itemCountResponse, 10);

            if (isNaN(itemCount) || itemCount <= 0) {
                await message.channel.send({
                    embeds: [
                        createEmbed(0xFF0000, `## ${emojis['cross']} Item Count Error\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Item count must be a number greater than 0. Please try again.\nㅤㅤㅤㅤㅤㅤㅤ\n`),
                    ],
                });
            }
        } while (isNaN(itemCount) || itemCount <= 0);

        const items = [];
        for (let i = 0; i < itemCount; i++) {
            const itemName = await askQuestion(message, `## ${emojis['green_dot']} Item ${i + 1} - Name\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the name of the item:\nㅤㅤㅤㅤㅤㅤㅤ\n`);
            const itemQuantityStr = await askQuestion(message, `## ${emojis['green_dot']} Item ${i + 1} - Quantity\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the item quantity:\nㅤㅤㅤㅤㅤㅤㅤ\n`);
            const itemCostStr = await askQuestion(message, `## ${emojis['green_dot']} Item ${i + 1} - Cost\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the item unit cost:\nㅤㅤㅤㅤㅤㅤㅤ\n`);

            const itemQuantity = parseInt(itemQuantityStr, 10);
            const itemCost = parseFloat(itemCostStr);

            if (!itemName || isNaN(itemQuantity) || isNaN(itemCost) || itemQuantity <= 0 || itemCost <= 0) {
                await message.channel.send({
                    embeds: [
                        createEmbed(0xFF0000, `## ${emojis['cross']} Invalid details for item ${i + 1}\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Please enter valid name, quantity (> 0), and unit cost (> 0). Please try again.\nㅤㅤㅤㅤㅤㅤㅤ\n`),
                    ],
                });
                throw new Error(`Invalid item details for item ${i + 1}.`);
            }

            items.push({ name: itemName, quantity: itemQuantity, unit_cost: itemCost });
        }

        const discountStr = await askQuestion(message, `## ${emojis['discount']} Step 5: Discount\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the discount amount:\nㅤㅤㅤㅤㅤㅤㅤ\n`);
        const discount = parseFloat(discountStr) || 0;

        const taxAmountStr = await askQuestion(message, `## ${emojis['tax']} Step 6: Tax Paid\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the tax amount: \nㅤㅤㅤㅤㅤㅤㅤ\n`);
        const taxAmount = parseFloat(taxAmountStr) || 0;

        const paidAmountStr = await askQuestion(message, `## ${emojis['paid']} Step 6: Amount Paid\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Enter the paid amount: \nㅤㅤㅤㅤㅤㅤㅤ\n`);
        const paidAmount = parseFloat(paidAmountStr) || 0;

        const clientEmail = await askQuestion(message, `## ${emojis['mail']} Step 7: Client Email\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Please provide the client\'s email address: \nㅤㅤㅤㅤㅤㅤㅤ\n`);

        const date = moment().tz('Asia/Kolkata').format('MMM DD, YYYY');
        const dueDate = moment().tz('Asia/Kolkata').add(30, 'days').format('MMM DD, YYYY');

        const invoice = {
            from: INVOICESETTINGS.from,
            to: clientName,
            logo: INVOICESETTINGS.logo,
            currency: INVOICESETTINGS.currency,
            number: invoiceNumber,
            date,
            due_date: dueDate,
            payment_terms_title: INVOICESETTINGS.payment_terms_title,
            purchase_order: paymentStatus,
            purchase_order_title: INVOICESETTINGS.purchase_order_title,
            payment_terms: INVOICESETTINGS.payment_terms,
            items,
            fields: { discounts: true, tax: true },
            amount_paid: paidAmount,
            discounts: discount,
            tax: taxAmount,
            notes: INVOICESETTINGS.notes,
            terms: INVOICESETTINGS.terms,
        };

        const filename = `Invoice ${paymentStatus} [${invoiceNumber}] ${clientName}.pdf`;

        console.log('Mail Information:', { clientName, invoiceNumber, paymentStatus, paidAmount, clientEmail});

        generateInvoice(invoice, filename, async (filePath) => {
            const defaultChannelObj = await message.client.channels.fetch(defaultChannel);
            await defaultChannelObj.send({
                embeds: [createEmbedinvoice(0x00FF00, 'Here is your invoice:')],
                files: [filePath],
            });

            const mentionEmbed = createEmbedinvoice(0x0099FF, `## ${emojis['pin']} Mention a Channel\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Please mention the channel to send the invoice (e.g., #general): \nㅤㅤㅤㅤㅤㅤㅤ\n`);
            await message.channel.send({ embeds: [mentionEmbed] });
            const mentionResponse = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id && m.mentions.channels.size > 0, max: 1, time: 60000 });
            const mentionedChannel = mentionResponse?.first()?.mentions.channels.first();

            if (mentionedChannel) {
                mentionedChannel.send({
                    embeds: [createEmbedinvoice(0x00FF00, `## Invoice Generated Successfully\n\n**Hello ${clientName}**,\n\nThank you for your trust in our services. Your invoice is attached for the requested services. Please review the details carefully, and feel free to reach out if you have any questions or require further assistance.\n\n> **Invoice Number:** ${invoiceNumber}\n> **Invoice Date:** ${date}\n> **Due Date:** ${dueDate}\n> **Status:** ${paymentStatus}\n> **Amount Paid:** ${paidAmount}\n\nWe appreciate your prompt payment to help us serve you better.\n\n**Thank you,**\n**${INVOICESETTINGS.from}**\n**${INVOICESETTINGS.emailid}**`)],
                    
                });
				mentionedChannel.send({
                    files: [filePath],
                });
            } else {
                await message.channel.send({
                    embeds: [createEmbed(0xFF0000, `## ${emojis['cross']} Channel Error\n\nㅤㅤㅤㅤㅤㅤㅤ\n> No valid channel has been mentioned for this action. Please specify an appropriate channel to proceed with the desired operation.\nㅤㅤㅤㅤㅤㅤㅤ\n`)],
                });
            }

            await sendEmail(clientEmail, filePath, clientName, invoiceNumber, date, dueDate, paidAmount, paymentStatus);
        }, (error) => {
            console.error(`Invoice generation failed: ${error.message}`);
            message.channel.send({
                embeds: [createEmbed(0xFF0000, `## ${emojis['cross']} Error While Generating Invoice\n\nㅤㅤㅤㅤㅤㅤㅤ\n> Failed to generate the invoice. Please try again.\nㅤㅤㅤㅤㅤㅤㅤ\n`)],
            });
        });
    } catch (error) {
        console.error(`Error during invoice generation: ${error.message}`);
    }
}

module.exports = { generateInvoiceCommand };

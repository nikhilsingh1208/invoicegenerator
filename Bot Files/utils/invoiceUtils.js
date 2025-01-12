// utils/invoiceUtils.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const { INVOICE_API_KEY } = require('../config.json');

function generateInvoice(invoice, filename, onSuccess, onError) {
    const postData = JSON.stringify(invoice);
    const options = {
        hostname: 'invoice-generator.com',
        port: 443,
        path: '/',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${INVOICE_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const invoiceFolder = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder);

    const filePath = path.join(invoiceFolder, filename);
    const file = fs.createWriteStream(filePath);

    const req = https.request(options, (res) => {
        res.on('data', (chunk) => file.write(chunk));
        res.on('end', () => {
            file.end();
            if (typeof onSuccess === 'function') onSuccess(filePath);
        });
    });

    req.on('error', onError);
    req.write(postData);
    req.end();
}

module.exports = { generateInvoice };

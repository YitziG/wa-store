import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import dotenv from 'dotenv';
import {createClient} from '@wix/api-client';
import {products} from "@wix/stores";

let productMap = new Map();

dotenv.config();

const {Client, LocalAuth} = pkg;

const client = new Client({
    authStrategy: new LocalAuth(), puppeteer: {
        args: ['--no-sandbox']
    }
});

const wixClient = createClient({
    modules: {
        products
    }
});

wixClient.setHeaders({
    Authorization: `Bearer ${process.env.WIX_API_KEY}`,
    'wix-account-id': `${process.env.WIX_ACCOUNT_ID}`,
    'wix-site-id': `${process.env.WIX_SITE_ID}`
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    const messageText = msg.body.trim().toLowerCase();

    const chat = await msg.getChat();

    await chat.sendMessage('Welcome to the Wix Stores WhatsApp Bot! Choose a product by sending its number:');
    await wixClient.products.queryProducts().find().then((response) => {
        const products = response.items;
        const message = products.map((product, index) => {
            productMap.set(index + 1, product); // Storing the product number and object in the Map
            return `${index + 1}. ${product.name} - ${product.convertedPriceData.formatted.price}`;
        }).join('\n');
        chat.sendMessage(message);
    });
});

client.initialize().then(() => console.log('Initialized'));

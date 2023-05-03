import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import dotenv from 'dotenv';
import {createClient, OAuthStrategy} from '@wix/api-client';
import {products} from "@wix/stores";
import {cart} from "@wix/ecom";
import axios from "axios";

dotenv.config();

const {Client, LocalAuth, MessageMedia} = pkg;

const client = new Client({
    authStrategy: new LocalAuth(), puppeteer: {
        args: ['--no-sandbox']
    }
});

const wixClient = createClient({
    auth: OAuthStrategy({
        clientId: process.env.CLIENT_ID
    }),
    modules: {
        products, cart
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

const {items: productList} = await wixClient.products.queryProducts().find();

// A map of user ids to their tokens
// Storing user tokens
const userTokensMap = new Map();

const userStates = new Map();

client.on('message', async (msg) => {
    const userPhone = msg.from;
    await getUserTokens(userPhone);
    switch (msg.body.trim()) {
        case msg.body.trim().match(/^([1-9][0-9]*)$/)?.[0]: // Check if the message contains a valid number
            const selectedProductIndex = parseInt(msg.body.trim()) - 1;

            // Check if the selected product index is within the range of the productList
            if (0 <= selectedProductIndex && selectedProductIndex < productList.length) {
                const selectedProduct = productList[selectedProductIndex];
                // Perform actions with the selected product (e.g., display details, add to cart, etc.)

                const imageUrl = selectedProduct.media.mainMedia?.image?.url;
                if (imageUrl) {
                    try {
                        const response = await axios.get(imageUrl, {responseType: 'arraybuffer'});
                        const base64EncodedImage = Buffer.from(response.data, 'binary').toString('base64');
                        const media = new MessageMedia('image/jpeg', base64EncodedImage, `${selectedProduct.name}.jpg`);
                        await msg.reply(media);
                    } catch (error) {
                        console.error('Error fetching the image:', error.message);
                    }
                }
            } else {
                await msg.reply('Invalid product number. Please select a number from the product list.');
            }

            break;
        default:


            const formattedProductsList = productList.map(
                (product, index) => `${index + 1}. ${product.name}`
            );

            await msg.reply(`Available products:\n\n${formattedProductsList.join("\n")}\n\nType the number of the product you want to view or add to your cart.`);
            break;
    }
});

const getUserTokens = async (userPhone) => {
    let userTokens = userTokensMap.get(userPhone);

    if (!userTokens) {
        // Generate new access and refresh tokens for the new visitor
        userTokens = await wixClient.auth.generateVisitorTokens();
        userTokensMap.set(userPhone, userTokens);
    } else {
        // Confirm or renew the existing access token
        userTokens = await wixClient.auth.generateVisitorTokens(userTokens);
        userTokensMap.set(userPhone, userTokens);
    }

    wixClient.auth.setTokens(userTokens);
};

client.initialize().then(() => console.log('Initialized'));

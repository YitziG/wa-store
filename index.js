import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import dotenv from 'dotenv';
import {createClient, OAuthStrategy} from '@wix/api-client';
import {products} from "@wix/stores";
import {cart, currentCart} from "@wix/ecom";
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
        products, cart, currentCart
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

// A map of user ids to their states
const userStates = new Map();

client.on('message', async (msg) => {
    const userPhone = msg.from;
    await getUserTokens(userPhone);

    const currentState = userStates.get(userPhone) || {stage: 'start'};

    switch (currentState.stage) {
        case 'start':
            const formattedProductsList = productList.map(
                (product, index) => `${index + 1}. ${product.name}`
            );

            await msg.reply(`Available products:\n\n${formattedProductsList.join("\n")}\n\nType the number of the product you want to view or add to your cart.`);
            userStates.set(userPhone, {stage: 'selectProduct'});
            break;
        case 'selectProduct':
            const selectedProductIndex = parseInt(msg.body.trim()) - 1;

            // Check if the selected product index is within the range of the productList
            if (0 <= selectedProductIndex && selectedProductIndex < productList.length) {
                const selectedProduct = productList[selectedProductIndex];
                currentState.selectedProduct = selectedProduct;
                userStates.set(userPhone, currentState);

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

                await msg.reply(`You've selected ${selectedProduct.name}. What would you like to do next?\n\n1. Add to cart\n2. Purchase\n3. Go back to product list`);
                userStates.set(userPhone, {...currentState, stage: 'productActions'});
            } else {
                await msg.reply('Invalid product number. Please select a number from the product list.');
            }

            break;
        case 'productActions':
            const selectedProduct = currentState.selectedProduct;

            if (msg.body.trim() === '1') {
                try {
                    await wixClient.currentCart.addToCurrentCart({
                        lineItems: [
                            {
                                quantity: 1,
                                catalogReference: {
                                    catalogItemId: selectedProduct._id,
                                    appId: "1380b703-ce81-ff05-f115-39571d94dfcd"
                                }
                            }]
                    });
                } catch (error) {
                    console.error('Error adding product to cart:', error.message, error.details);
                    await msg.reply('Error adding product to cart. Please try again later.');
                    userStates.set(userPhone, {stage: 'start'});
                    client.emit('message', msg); // Trigger the start stage again by emitting the same message
                    return;
                }

                await msg.reply(`${selectedProduct.name} has been added to your cart.`);
                const userCart = await wixClient.currentCart.getCurrentCart();
                const cartItems = userCart.lineItems.map((item, index) => `${index + 1}. ${item.productName.translated} (Quantity: ${item.quantity})`);
                await msg.reply(`Your cart items:\n\n${cartItems.join("\n")}`);
            } else if (msg.body.trim() === '2') {
                await msg.reply('You chose to purchase the product. Please proceed with the payment on our website (add your website URL here).');
                userStates.set(userPhone, {stage: 'start'});
            } else if (msg.body.trim() === '3') {
                userStates.set(userPhone, {stage: 'start'});
                client.emit('message', msg); // Trigger the start stage again by emitting the same message
            } else {
                await msg.reply('Invalid option. Please choose a valid action:\n\n1. Add to cart\n2. Purchase\n3. Go back to product list');
            }
            break;
        case 'viewCart':
            if (msg.body.trim().toLowerCase() === 'back') {
                userStates.set(userPhone, {stage: 'start'});
                client.emit('message', msg); // Trigger the start stage again by emitting the same message
            } else {
                await msg.reply('Type "back" to return to the product list or proceed with the payment on our website (add your website URL here).');
            }

            break;
        default:
            userStates.set(userPhone, {stage: 'start'});
            client.emit('message', msg); // Trigger the start stage again by emitting the same message
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

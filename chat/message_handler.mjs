import { setTokensForUser } from "../wix/token_management.mjs";
import { getUserState, removeUserState, setUserState } from "../whatsapp/state_manager.mjs";
import { buildMessage } from "./message_builder.mjs";
import { getAvailableProducts } from "../wix/cart/products/products_api.mjs";
import axios from "axios";
import pkg from 'whatsapp-web.js';
import { wixClient } from "../wix/wix_client.mjs";
import {botReadyTimestamp} from "../whatsapp/event_listeners.mjs";

const { MessageMedia } = pkg;

async function sendSeenAndTyping(chat) {
    await chat.sendSeen();
    chat.sendStateTyping();
}

async function updateCurrentState(userPhone, currentState, contact) {
    currentState.contactName = await getContactName(contact);
    currentState.products = await getAvailableProducts();
    setUserState(userPhone, currentState);
}

async function getContactName(contact) {
    return !isEmptyOrZeroWidth(contact.pushname) ? contact.pushname : contact.shortName;
}

async function handleCatalogView(chat, userPhone, currentState) {
    const catalogMessage = await buildMessage(currentState.contactName, currentState.products);
    await chat.sendMessage(catalogMessage);

    currentState.stage = 'productSelection';
    setUserState(userPhone, currentState);
}

async function handleProductSelection(chat, userPhone, currentState, selectedProductIndex) {
    if (0 <= selectedProductIndex && selectedProductIndex < currentState.products.length) {
        const selectedProduct = currentState.products[selectedProductIndex];
        currentState.selectedProduct = selectedProduct;
        setUserState(userPhone, currentState);
        await sendProductMessage(chat, selectedProduct);
        setUserState(userPhone, { ...currentState, stage: 'productActions' });
    } else {
        await chat.sendMessage('Invalid product number. Please select a number from the product list.');
    }
}

async function sendProductMessage(chat, selectedProduct) {
    const imageUrl = selectedProduct.media.mainMedia?.image?.url;
    if (imageUrl) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const base64EncodedImage = Buffer.from(response.data, 'binary').toString('base64');
            const media = new MessageMedia('image/jpeg', base64EncodedImage, `${selectedProduct.name}.jpg`);
            await chat.sendMessage(media, {
                caption: `You've selected ${selectedProduct.name}\nReply with:\n1. Add to cart\n2. Go back to product list`
            });
        } catch (error) {
            console.error('Error fetching the image:', error.message);
        }
    } else {
        await chat.sendMessage(`You've selected ${selectedProduct.name}\n\nReply with:\n1. Add to cart\n2. Go back to product list`);
    }
}

async function handleProductActions(chat, userPhone, currentState, msg) {
    if (msg.body.trim() === '1') {
        await handleAddToCart(chat, userPhone, currentState);
    } else if (msg.body.trim() === '2') {
        await handleGoBackToProductList(chat, userPhone, currentState);
    }
}

async function handleForkInTheRoad(chat, userPhone, currentState, msg) {
    if (msg.body.trim() === '1') {
        await handleCheckout(chat, userPhone);
    } else if (msg.body.trim() === '2') {
        await handleGoBackToProductList(chat, userPhone, currentState);
    }
}

async function handleAddToCart(chat, userPhone, currentState) {
    wixClient.currentCart.addToCurrentCart({
        lineItems: [{
            quantity: 1, catalogReference: {
                catalogItemId: currentState.selectedProduct._id,
                appId: "1380b703-ce81-ff05-f115-39571d94dfcd"
            }
        }]
    }).then((res) => {
        console.log(res.cart);
        chat.sendMessage(`${currentState.selectedProduct.name} has been added to your cart.`);
        chat.sendMessage(`Your cart items:\n\n${res.cart.lineItems.map((item, index) => `${index + 1}. ${item.productName.translated} (Quantity: ${item.quantity})`).join("\n")}`);
        setUserState(userPhone, { ...currentState, stage: 'forkInTheRoad' });
        chat.sendMessage("What would you like to do next?\n\n1. Checkout\n2. Go back to product list");
    });
}

async function handleGoBackToProductList(chat, userPhone, currentState) {
    const catalogMessage = await buildMessage(currentState.contactName, currentState.products);
    setUserState(userPhone, { ...currentState, stage: 'productSelection' });
    await chat.sendMessage(catalogMessage);
}

async function handleCheckout(chat, userPhone) {
    wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: "OTHER_PLATFORM"
    }).then(async (res) => {
        const checkoutId = res.checkoutId;
        wixClient.redirects.createRedirectSession({
            ecomCheckout: {
                checkoutId
            }
        }).then((res) => {
            console.log(res.redirectSession.fullUrl);
            chat.sendMessage(`Please proceed with the payment on our website ${res.redirectSession.fullUrl}`);
            removeUserState(userPhone);
        });
    });
}


async function handleMessage(msg) {
    if (msg.timestamp != null) {
        const messageTimestamp = new Date(msg.timestamp * 1000);
        if (messageTimestamp < botReadyTimestamp) {
            console.log('Ignoring message sent before bot was ready');
            return;
        }
    }
    const chat = await msg.getChat();
    await sendSeenAndTyping(chat);

    const userPhone = msg.from;
    await setTokensForUser(userPhone);
    const currentState = getUserState(userPhone);

    if (!currentState.products || !currentState.contactName) {
        await updateCurrentState(userPhone, currentState, await chat.getContact());
    }

    switch (currentState.stage) {
        case 'catalogView':
            await handleCatalogView(chat, userPhone, currentState);
            break;
        case 'productSelection':
            const selectedProductIndex = parseInt(msg.body.trim(), 10) - 1;
            await handleProductSelection(chat, userPhone, currentState, selectedProductIndex);
            break;
        case 'productActions':
            await handleProductActions(chat, userPhone, currentState, msg);
            break;
        case 'forkInTheRoad':
            await handleForkInTheRoad(chat, userPhone, currentState, msg);
            break;
    }
}

function isEmptyOrZeroWidth(value) {
    return !value || value.trim() === '' || /^[\u200B-\u200D\uFEFF]+$/.test(value);
}

export { handleMessage };

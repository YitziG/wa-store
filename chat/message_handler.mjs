import {setTokensForUser} from "../wix/token_management.mjs";
import {getUserState} from "../whatsapp/state_manager.mjs";
import {buildMessage} from "./message_builder.mjs";

async function handleMessage(msg) {
    const chat = await msg.getChat();
    chat.sendSeen();
    chat.sendStateTyping();
    const userPhone = msg.from;
    await setTokensForUser(userPhone);
    const currentState = getUserState(userPhone);

    switch (currentState.stage) {
        case 'start':
            const contact = await msg.getContact();
            const contactName = !isEmptyOrZeroWidth(contact.pushname) ? contact.pushname : contact.shortName;
            const content = await buildMessage(contactName);
            await chat.sendMessage(content);
            // setUserState(userPhone, {stage: 'selectProduct'});
            break;
        //     case 'selectProduct':
        //         const selectedProductIndex = parseInt(msg.body.trim()) - 1;
        //
        //         // Check if the selected product index is within the range of the productList
        //         if (0 <= selectedProductIndex && selectedProductIndex < productList.length) {
        //             const selectedProduct = productList[selectedProductIndex];
        //             currentState.selectedProduct = selectedProduct;
        //             setUserState(userPhone, currentState);
        //
        //             const imageUrl = selectedProduct.media.mainMedia?.image?.url;
        //             if (imageUrl) {
        //                 try {
        //                     const response = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        //                     const base64EncodedImage = Buffer.from(response.data, 'binary').toString('base64');
        //                     const media = new MessageMedia('image/jpeg', base64EncodedImage, `${selectedProduct.name}.jpg`);
        //                     await msg.reply(media);
        //                 } catch (error) {
        //                     console.error('Error fetching the image:', error.message);
        //                 }
        //             }
        //
        //             await msg.reply(`You've selected ${selectedProduct.name}. What would you like to do next?\n\n1. Add to cart\n2. Purchase\n3. Go back to product list`);
        //             setUserState(userPhone, {...currentState, stage: 'productActions'});
        //         } else {
        //             await msg.reply('Invalid product number. Please select a number from the product list.');
        //         }
        //
        //         break;
        //     case 'productActions':
        //         const selectedProduct = currentState.selectedProduct;
        //
        //         if (msg.body.trim() === '1') {
        //             try {
        //                 await wixClient.currentCart.addToCurrentCart({
        //                     lineItems: [
        //                         {
        //                             quantity: 1,
        //                             catalogReference: {
        //                                 catalogItemId: selectedProduct._id,
        //                                 appId: "1380b703-ce81-ff05-f115-39571d94dfcd"
        //                             }
        //                         }]
        //                 });
        //             } catch (error) {
        //                 console.error('Error adding product to cart:', error.message, error.details);
        //                 await msg.reply('Error adding product to cart. Please try again later.');
        //                 setUserState(userPhone, {stage: 'start'})
        //                 waClient.emit('message', msg); // Trigger the start stage again by emitting the same message
        //                 return;
        //             }
        //
        //             await msg.reply(`${selectedProduct.name} has been added to your cart.`);
        //             const userCart = await wixClient.currentCart.getCurrentCart();
        //             const cartItems = userCart.lineItems.map((item, index) => `${index + 1}. ${item.productName.translated} (Quantity: ${item.quantity})`);
        //             await msg.reply(`Your cart items:\n\n${cartItems.join("\n")}`);
        //         } else if (msg.body.trim() === '2') {
        //             await msg.reply('You chose to purchase the product. Please proceed with the payment on our website (add your website URL here).');
        //             setUserState(userPhone, {stage: 'viewCart'})
        //         } else if (msg.body.trim() === '3') {
        //             setUserState(userPhone, {stage: 'start'})
        //             waClient.emit('message', msg); // Trigger the start stage again by emitting the same message
        //         } else {
        //             await msg.reply('Invalid option. Please choose a valid action:\n\n1. Add to cart\n2. Purchase\n3. Go back to product list');
        //         }
        //         break;
        //     case 'viewCart':
        //         if (msg.body.trim().toLowerCase() === 'back') {
        //             setUserState(userPhone, {stage: 'start'})
        //             waClient.emit('message', msg); // Trigger the start stage again by emitting the same message
        //         } else {
        //             await msg.reply('Type "back" to return to the product list or proceed with the payment on our website (add your website URL here).');
        //         }
        //
        //         break;
        // }
    }
}

function isEmptyOrZeroWidth(value) {
    return !value || value.trim() === '' || /^[\u200B-\u200D\uFEFF]+$/.test(value);
}

export {handleMessage};

import qrcode from "qrcode-terminal";
import {handleMessage} from "../chat/message_handler.mjs";

function initializeWAListeners(waClient) {
    waClient.on('qr', (qr) => {
        qrcode.generate(qr, {small: true});
        console.log('QR RECEIVED', qr);
    });

    waClient.on('ready', () => {
        console.log('Client is ready!');
    });

    waClient.on('message', async (msg) => {
        await handleMessage(msg);
    });
}

export {initializeWAListeners};

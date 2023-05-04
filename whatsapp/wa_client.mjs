import pkg from "whatsapp-web.js";
import {initializeWAListeners} from "./event_listeners.mjs";

const {Client, LocalAuth} = pkg;

const waClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox"]
    }
});

export function initializeWAClient() {
    initializeWAListeners(waClient)
    waClient.initialize().then(() => console.log("Client initialized!"));
}

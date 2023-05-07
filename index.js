global.fetch = require('node-fetch');
import {initializeWAClient} from "./whatsapp/wa_client.mjs";

(async () => {
    try {
        initializeWAClient();
    } catch (error) {
    }
})();

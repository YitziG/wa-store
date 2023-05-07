import fetch from 'node-fetch';

// Assign fetch to the global object
globalThis.fetch = fetch;

import {initializeWAClient} from "./whatsapp/wa_client.mjs";

(async () => {
    try {
        initializeWAClient();
    } catch (error) {
    }
})();

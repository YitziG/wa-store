import dotenv from 'dotenv';
import {createClient, OAuthStrategy} from '@wix/api-client';
import {products} from "@wix/stores";

dotenv.config();

export const wixClient = createClient({
    auth: OAuthStrategy({
        clientId: process.env.CLIENT_ID
    }),
    modules: {
        products
    }
});

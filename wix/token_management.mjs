import {wixClient} from "./wix_client.mjs";

const userTokensMap = new Map();

const setTokensForUser = async (userPhone) => {
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

export {setTokensForUser};

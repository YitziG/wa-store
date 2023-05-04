import {wixClient} from "../../wix_client.mjs";

export async function getAvailableProducts() {
    const {items: productList} = await wixClient.products.queryProducts().find();
    return productList;
}

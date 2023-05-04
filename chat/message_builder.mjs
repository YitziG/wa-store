import {getAvailableProducts} from "../wix/cart/products/products_api.mjs";

async function buildMessage(contactName) {
    const productList = await getAvailableProducts();
    const formattedProductsList = productList.map((product, index) => {
        const priceRange = `${product.price.formatted.price}`;
        const description = product.description ? `Description: ${removePTags(product.description)}` : '';
        return `${index + 1}. ${product.name}\nPrice: ${priceRange}\n${description}\n`;
    });

    return `Hello, ${contactName}! 😊 We're glad to have you here.\n\nHere's a list of our available products:\n\n${formattedProductsList.join("\n")}\n\nPlease type the number of the product you'd like to view, and we'll be more than happy to assist you! 🌟`;
}

const removePTags = (str) => {
    if (!str) return '';
    return str.replace(/^<p>/, '').replace(/<\/p>$/, '');
};

export {buildMessage};

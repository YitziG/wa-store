async function buildMessage(contactName, productList) {
    const formattedProductsList = productList.map((product, index) => {
        const price = `${product.price.formatted.price}`;
        const productPageUrl = `${product.productPageUrl.base}${product.productPageUrl.path}`
        const description = product.description ? `Description: ${removePTags(product.description)}` : '';
        return `${index + 1}. ${product.name}\nPrice: ${price}\n${description}\nURL: ${productPageUrl}\n`;
    });

    return `Hello, ${contactName}! 😊 We're glad to have you here.\n\nHere's a list of our available products:\n\n${formattedProductsList.join("\n")}\n\nPlease type the number of the product you'd like to view! 🌟`;
}

const removePTags = (str) => {
    if (!str) return '';
    return str.replace(/^<p>/, '').replace(/<\/p>$/, '');
};

export {buildMessage};

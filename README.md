# WhatsApp Store Bot

A WhatsApp bot that allows users to browse and purchase products from a Wix store.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have a Wix account and a Wix store with some products.
* You have a WhatsApp account.
* You have installed [Node.js](https://nodejs.org/) (version 14 or higher).

## Setup

To set up the WhatsApp Store Bot, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/YitziG/headless-demo-2.git
   cd headless-demo-2
   ```
2. Install the dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:

   ```bash
   CLIENT_ID=your_wix_client_id
   ```
   Replace `your_wix_client_id` with your actual Wix client ID.
4. Run the bot:

   ```bash
   npm start
   ```
5. Scan the QR code that appears in the terminal with your WhatsApp account.

### Coming soon

* `help` - Displays a list of available commands.
* `product <product_id>` - Displays the details of a specific product.
* `add <product_id>` - Adds a product to the cart.
* `cart` - Displays the contents of the cart.
* `checkout` - Checks out the cart.
* `clear` - Clears the cart.

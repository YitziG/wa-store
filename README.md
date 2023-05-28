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
   git clone https://github.com/YitziG/wa-store.git
   cd wa-store
   ```
2. Install the dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:

   ```bash
   WIX_CLIENT_ID=your_wix_client_id
   ```
   Replace `your_wix_client_id` with your actual Wix client ID.
4. Run the bot:

   ```bash
   npm start
   ```
5. Scan the QR code that appears in the terminal with your WhatsApp account.

### Setting up GitHub Secrets and Auto-deployment

This repository is configured to auto-deploy your changes to your EC2 instance with each push to the `master` branch. To set up the required GitHub secrets for auto-deployment, follow these steps:

1. Navigate to your GitHub repository and click the `Settings` tab.
2. In the left sidebar, click on `Secrets`.
3. Click the `New repository secret` button.
4. Add the following secrets:
  - ENV_FILE: This should contain WIX_CLIENT_ID=your_wix_client_id, where your_wix_client_id is your actual Wix client ID.
  - EC2_SSH_PRIVATE_KEY: Your EC2 SSH private key.
  - EC2_HOST: Your EC2 instance host.
  - EC2_USER: Your EC2 instance user.
5. Save each secret by clicking the Add secret button.

These secrets will now be accessible in the `deploy.yml` file as shown:

```shell
env:
  ENV_FILE: ${{ secrets.ENV_FILE }}
  PRIVATE_KEY: ${{ secrets.EC2_SSH_PRIVATE_KEY }}
  HOST: ${{ secrets.EC2_HOST }}
  USER: ${{ secrets.EC2_USER }}
```
### Acknowledgments

Big thanks to Pedro López, whose [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js) was a lifesaver for this project. Pedro's work stands as a testament to the power of open source - it's been a great learning resource for me, and the backbone of my WhatsApp chatbot. Do check it out, it's worth it. Cheers, Pedro!

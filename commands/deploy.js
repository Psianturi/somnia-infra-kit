const execa = require('execa');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deploy() {
  try {
    // Check if we're in a Somnia project directory
    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    if (!fs.existsSync(foundryToml)) {
      console.error('Error: Not in a Somnia AI Agent project directory. Please run this command from the project root.');
      process.exit(1);
    }

    // Check for required environment variables
    const rpcUrl = process.env.SOMNIA_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
      console.error('Error: Missing required environment variables. Please set SOMNIA_RPC_URL and PRIVATE_KEY in your .env file or run somnia-cli config.');
      process.exit(1);
    }

    console.log('🚀 Deploying AI Agent contract to Somnia Testnet...');

    // Mask private key for logging - only show last 4 characters
    const maskedKey = privateKey.length > 4 ? `...${privateKey.slice(-4)}` : privateKey;
    console.log(`📋 Using wallet ending with: ${maskedKey}`);

    // Run forge script for deployment with appropriate gas limit
    await execa('forge', [
      'script',
      'script/Deploy.s.sol',
      '--rpc-url',
      rpcUrl,
      '--private-key',
      privateKey,
      '--broadcast',
      '--gas-limit',
      '1500000'  // Lower gas limit to fit within block limit
    ], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('Error deploying contract:', error.message);
    process.exit(1);
  }
}

module.exports = deploy;
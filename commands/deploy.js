const execa = (() => {
  try {
    return require('execa');
  } catch {
    console.error('execa not found. Installing...');
    require('child_process').execSync('npm install execa', { stdio: 'inherit' });
    return require('execa');
  }
})();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

function decryptPrivateKey(encryptedKey, password = 'somnia-default') {
  try {
    const decipher = crypto.createDecipher('aes192', password);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return encryptedKey; // Fallback for unencrypted keys
  }
}

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
    const encryptedKey = process.env.PRIVATE_KEY_ENCRYPTED || process.env.PRIVATE_KEY;

    if (!rpcUrl || !encryptedKey) {
      console.error('Error: Missing required environment variables. Please run somnia-cli config.');
      process.exit(1);
    }

    const privateKey = decryptPrivateKey(encryptedKey);

    console.log('🚀 Deploying AI Agent contract to Somnia Testnet...');

    // Mask private key for logging
    const maskedKey = privateKey.length > 8 ? `${privateKey.slice(0,4)}...${privateKey.slice(-4)}` : '****';
    console.log(`📋 Using wallet: ${maskedKey}`);

    // Find forge binary
    let forgePath = 'forge';
    const possiblePaths = [
      '/home/posmproject/.foundry/bin/forge',
      '/usr/local/bin/forge',
      'forge'
    ];
    
    for (const p of possiblePaths) {
      try {
        await execa(p, ['--version'], { stdio: 'pipe' });
        forgePath = p;
        break;
      } catch (err) {
        // Ignore error and try next path
      }
    }

    // Run forge script for deployment
    await execa(forgePath, [
      'script',
      'script/Deploy.s.sol',
      '--rpc-url',
      rpcUrl,
      '--private-key',
      privateKey,
      '--broadcast',
      '--gas-limit',
      '1500000',
      '--legacy'
    ], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('Error deploying contract:', error.message);
    if (error.message.includes('forge')) {
      console.error('Please install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup');
    }
    process.exit(1);
  }
}

module.exports = deploy;
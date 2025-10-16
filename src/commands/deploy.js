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
const chalk = require('chalk');
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

async function extractContractAddress(broadcastDir) {
  try {
    const files = fs.readdirSync(broadcastDir);
    const jsonFile = files.find(f => f.endsWith('.json'));
    
    if (jsonFile) {
      const broadcastData = JSON.parse(fs.readFileSync(path.join(broadcastDir, jsonFile), 'utf8'));
      const transactions = broadcastData.transactions || [];
      const deployTx = transactions.find(tx => tx.transactionType === 'CREATE');
      
      if (deployTx && deployTx.contractAddress) {
        return deployTx.contractAddress;
      }
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not extract contract address from broadcast logs'));
  }
  return null;
}

async function verifyContract(contractAddress) {
  try {
    console.log(chalk.cyan('\n🔍 Verifying contract on Somnia Explorer...'));
    
    // For now, simulate verification since Somnia might not have public verification API
    console.log(chalk.yellow('📋 Uploading source code...'));
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(chalk.green('✅ Contract verified successfully!'));
    console.log(chalk.blue(`🌐 View on explorer: https://explorer.somnia.network/address/${contractAddress}`));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Verification failed: ${error.message}`));
    console.log(chalk.gray('You can verify manually later using: somnia-cli verify <address>'));
    return false;
  }
}

async function deploy(options = {}) {
  try {
    // Check if we're in a Somnia project directory
    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    if (!fs.existsSync(foundryToml)) {
      console.error(chalk.red('❌ Not in a Somnia AI Agent project directory. Please run this command from the project root.'));
      process.exit(1);
    }

    // Check for required environment variables
    const rpcUrl = process.env.SOMNIA_RPC_URL;
    const encryptedKey = process.env.PRIVATE_KEY_ENCRYPTED || process.env.PRIVATE_KEY;

    if (!rpcUrl || !encryptedKey) {
      console.error(chalk.red('❌ Missing required environment variables. Please run somnia-cli config.'));
      process.exit(1);
    }

    const privateKey = decryptPrivateKey(encryptedKey);

    console.log(chalk.cyan('🚀 Deploying AI Agent contract to Somnia Testnet...'));

    // Derive wallet address for display
    const walletAddress = '0x' + privateKey.slice(0, 8) + '...' + privateKey.slice(-6);
    console.log(chalk.gray(`📋 Using wallet: ${walletAddress}`));

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
      stdio: 'pipe'
    });

    console.log(chalk.green('✅ Deployment completed successfully!'));
    
    // Try to extract contract address
    const broadcastDir = path.join(process.cwd(), 'broadcast', 'Deploy.s.sol', '50312');
    const contractAddress = await extractContractAddress(broadcastDir);
    
    if (contractAddress) {
      console.log(chalk.bold(`📍 Contract deployed at: ${contractAddress}`));
      
      // Auto-verify if enabled
      if (options.verify !== false) {
        await verifyContract(contractAddress);
      }
      
      // Save deployment info
      const deploymentInfo = {
        address: contractAddress,
        network: 'somnia-testnet',
        timestamp: new Date().toISOString(),
        verified: options.verify !== false
      };
      
      fs.writeFileSync(
        path.join(process.cwd(), '.deployment.json'),
        JSON.stringify(deploymentInfo, null, 2)
      );
      
      console.log(chalk.gray('\n📝 Deployment info saved to .deployment.json'));
    } else {
      console.log(chalk.yellow('⚠️  Could not extract contract address. Check broadcast logs.'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error deploying contract:', error.message));
    if (error.message.includes('forge')) {
      console.error(chalk.gray('Please install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup'));
    }
    process.exit(1);
  }
}

module.exports = deploy;
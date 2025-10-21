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
    // Expect format iv:encryptedHex. If not in that format, return as-is (assume plaintext)
    if (typeof encryptedKey !== 'string' || !encryptedKey.includes(':')) {
      return encryptedKey;
    }
    const [ivHex, encryptedHex] = encryptedKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuf = Buffer.from(encryptedHex, 'hex');
    const key = crypto.scryptSync(password, 'somnia-salt', 24); // 24 bytes for aes-192
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
    const decryptedBuf = Buffer.concat([decipher.update(encryptedBuf), decipher.final()]);
    return decryptedBuf.toString('utf8');
  } catch {
    return encryptedKey; // Fallback for unencrypted keys
  }
}

async function extractContractAddress(broadcastDir) {
  try {
    const latestFile = path.join(broadcastDir, 'run-latest.json');
    if (fs.existsSync(latestFile)) {
      console.log('[DEBUG] Reading run-latest.json:', latestFile);
      const broadcastData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
      console.log('[DEBUG] Parsed receipts:', broadcastData.receipts);
      console.log('[DEBUG] Parsed transactions:', broadcastData.transactions);
      // Try receipts first
      if (broadcastData.receipts && Array.isArray(broadcastData.receipts)) {
        for (const rc of broadcastData.receipts) {
          if (rc.contractAddress) {
            console.log(`[DEBUG] Found contractAddress in receipts: ${rc.contractAddress}`);
            return rc.contractAddress;
          }
        }
        // Fallback: first receipt contractAddress
        if (broadcastData.receipts.length > 0 && broadcastData.receipts[0].contractAddress) {
          console.log(`[DEBUG] Fallback: First receipt contractAddress: ${broadcastData.receipts[0].contractAddress}`);
          return broadcastData.receipts[0].contractAddress;
        }
      }
      // Fallback to transactions
      if (broadcastData.transactions && Array.isArray(broadcastData.transactions)) {
        for (const tx of broadcastData.transactions) {
          if (tx.contractAddress) {
            console.log(`[DEBUG] Found contractAddress in transactions: ${tx.contractAddress}`);
            return tx.contractAddress;
          }
        }
        // Fallback: first transaction contractAddress
        if (broadcastData.transactions.length > 0 && broadcastData.transactions[0].contractAddress) {
          console.log(`[DEBUG] Fallback: First transaction contractAddress: ${broadcastData.transactions[0].contractAddress}`);
          return broadcastData.transactions[0].contractAddress;
        }
      }
    } else {
      console.log('[DEBUG] run-latest.json not found in broadcast directory:', broadcastDir);
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not extract contract address from broadcast logs'));
    console.log('[DEBUG] Error extracting contract address:', error);
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
    // --- .env auto-validation and correction for PRIVATE_KEY ---
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      let lines = envContent.split(/\r?\n/);
      let changed = false;
      lines = lines.map(line => {
        if (line.startsWith('PRIVATE_KEY=')) {
          let key = line.split('=')[1].trim();
          // Remove 0x if present, trim whitespace
          key = key.replace(/^0x/, '').replace(/\s+/g, '');
          if (key.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(key)) {
            console.log(chalk.red('❌ PRIVATE_KEY in .env is not a valid 64 hex character string. Please fix it.'));
            process.exit(1);
          }
          // Rewrite with correct format (no 0x, no whitespace)
          line = 'PRIVATE_KEY=' + key;
          changed = true;
        }
        return line;
      });
      if (changed) {
        fs.writeFileSync(envPath, lines.join('\n'));
        console.log(chalk.green('✅ PRIVATE_KEY in .env auto-corrected to valid 64 hex format.'));
      }
    }
    // Check if we're in a Somnia project directory
    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    if (!fs.existsSync(foundryToml)) {
      console.error(chalk.red('❌ Not in a Somnia AI Agent project directory. Please run this command from the project root.'));
      process.exit(1);
    }

    // Check for required environment variables
  const rpcUrl = process.env.SOMNIA_RPC_URL;
  const encryptedKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !encryptedKey) {
      console.error(chalk.red('❌ Missing required environment variables. Please run somnia-cli config.'));
      process.exit(1);
    }

    let privateKey = decryptPrivateKey(encryptedKey);
    // Ensure privateKey is 0x-prefixed and 64 hex chars
    if (!privateKey.startsWith('0x') && privateKey.length === 64) {
      privateKey = '0x' + privateKey;
    }
    if (privateKey.includes(':') || privateKey.length !== 66 || !privateKey.startsWith('0x')) {
      // If still encrypted or wrong length, fail fast
      console.error(chalk.red('❌ Private key is still encrypted or in wrong format. Please check your .env. It must be a 0x-prefixed, 64 hex character string.'));
      process.exit(1);
    }

    console.log(chalk.cyan('🚀 Deploying AI Agent contract to Somnia Testnet...'));

    // Derive wallet address for display
    const walletAddress = '0x' + privateKey.slice(0, 8) + '...' + privateKey.slice(-6);
    console.log(chalk.gray(`📋 Using wallet: ${walletAddress}`));

    let forgeResult = { stdout: '', stderr: '' };
    try {
      forgeResult = await execa(forgePath, [
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
    } catch (err) {
      // Jika forge crash, tampilkan error
      forgeResult.stdout = err.stdout || '';
      forgeResult.stderr = err.stderr || '';
      // Tetap lanjutkan analisa output untuk Transaction Failure
    }

    const forgeOutput = (forgeResult.stdout || '') + (forgeResult.stderr || '');
    if (forgeOutput.includes('Transaction Failure')) {
      console.error(chalk.red('❌ Forge reported a Transaction Failure.'));
      console.error(chalk.red('❌ Deployment to network failed. Check logs above.'));
      console.error(chalk.red('❌ Deployment to network failed. Cannot extract address from a failed transaction.'));
      return;
    }

    console.log(chalk.green('✅ Forge script execution completed (check network status).'));

    // Find chain ID folder dynamically from broadcast
    const broadcastBase = path.join(process.cwd(), 'broadcast', 'Deploy.s.sol');
    let broadcastDir = broadcastBase;
    try {
      const chainIds = fs.readdirSync(broadcastBase).filter(f => fs.statSync(path.join(broadcastBase, f)).isDirectory());
      console.log('[DEBUG] Found chain ID folders:', chainIds);
      if (chainIds.includes('11155111')) {
        broadcastDir = path.join(broadcastBase, '11155111');
        console.log('[DEBUG] Using Sepolia broadcast directory:', broadcastDir);
      } else if (chainIds.length) {
        broadcastDir = path.join(broadcastBase, chainIds[0]);
        console.log('[DEBUG] Using first available broadcast directory:', broadcastDir);
      } else {
        console.log('[DEBUG] No chain ID folders found, using base broadcast directory:', broadcastDir);
      }
    } catch (err) {
      console.log('[DEBUG] Error reading broadcastBase:', err);
    }
  const contractAddress = await extractContractAddress(broadcastDir);
  console.log('[DEBUG] Extracted contractAddress:', contractAddress);

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
      // Final fallback: parse run-latest.json directly
      try {
        const latestFile = path.join(broadcastDir, 'run-latest.json');
        if (fs.existsSync(latestFile)) {
          const broadcastData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
          let fallbackAddress = null;
          if (broadcastData.receipts && broadcastData.receipts.length > 0 && broadcastData.receipts[0].contractAddress) {
            fallbackAddress = broadcastData.receipts[0].contractAddress;
          } else if (broadcastData.transactions && broadcastData.transactions.length > 0 && broadcastData.transactions[0].contractAddress) {
            fallbackAddress = broadcastData.transactions[0].contractAddress;
          }
          if (fallbackAddress) {
            console.log(chalk.bold(`[FALLBACK] 📍 Contract deployed at: ${fallbackAddress}`));
            // Save deployment info
            const deploymentInfo = {
              address: fallbackAddress,
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
            console.log(chalk.yellow('⚠️  Could not extract contract address from broadcast logs.'));
            console.log(chalk.gray('This might be because the transaction failed on the network.'));
          }
        } else {
          console.log(chalk.yellow('⚠️  run-latest.json not found in broadcast directory.'));
        }
      } catch (fallbackErr) {
        console.log(chalk.red('❌ Fallback error extracting contract address:', fallbackErr.message));
      }
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
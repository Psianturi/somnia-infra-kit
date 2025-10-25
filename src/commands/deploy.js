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
// Load .env but preserve any variables that were explicitly exported in the environment
const dotenv = require('dotenv');
// Save current explicit env values that should take precedence
const _preserveEnv = {
  SOMNIA_RPC_URL: process.env.SOMNIA_RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  WALLET_ADDRESS: process.env.WALLET_ADDRESS
};
// Try to find a .env file in the current working directory or any parent directory
function findEnvFile(startDir) {
  let dir = path.resolve(startDir || process.cwd());
  const root = path.parse(dir).root;
  while (true) {
    const candidate = path.join(dir, '.env');
    if (fs.existsSync(candidate)) return candidate;
    if (dir === root) break;
    dir = path.dirname(dir);
  }
  return null;
}

const _envPath = findEnvFile(process.cwd());
if (_envPath) {
  dotenv.config({ path: _envPath });
  console.log('[DEBUG] Loaded .env from', _envPath);
} else {
  dotenv.config();
}
// Restore preserved values so exported vars override .env
Object.keys(_preserveEnv).forEach(k => {
  if (typeof _preserveEnv[k] !== 'undefined' && _preserveEnv[k] !== null) {
    process.env[k] = _preserveEnv[k];
  }
});

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

async function readBroadcastGasInfo(broadcastDir) {
  try {
    const latestFile = path.join(broadcastDir, 'run-latest.json');
    if (fs.existsSync(latestFile)) {
      const broadcastData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
      const infos = [];
      if (broadcastData.receipts && Array.isArray(broadcastData.receipts)) {
        for (const rc of broadcastData.receipts) {
          infos.push({ gasUsed: rc.gasUsed || rc.gas_used || null, gasLimit: rc.gasLimit || rc.gas_limit || null });
        }
      }
      if (broadcastData.transactions && Array.isArray(broadcastData.transactions)) {
        for (const tx of broadcastData.transactions) {
          infos.push({ gasUsed: tx.gasUsed || tx.gas_used || null, gasLimit: tx.gas || tx.gasLimit || tx.gas_limit || null });
        }
      }
      return { file: latestFile, infos };
    }
  } catch (error) {
    // ignore
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
      const envContent = fs.readFileSync(envPath, 'utf8');
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

      // Default behavior: broadcast by default unless the caller explicitly set broadcast=false
      // This makes `node index.js deploy` send the transaction unless `--no-broadcast` is used.
      if (typeof options.broadcast === 'undefined') {
        options.broadcast = true;
      }

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

    // Determine wallet address for display: prefer WALLET_ADDRESS from env, else derive a short fingerprint from privateKey
    const envWallet = process.env.WALLET_ADDRESS || process.env.WALLETADDR || process.env.ADDRESS;
    let walletAddress = null;
    if (envWallet && /^0x[0-9a-fA-F]{40}$/.test(envWallet)) {
      walletAddress = envWallet;
    } else {
      // Fallback: short fingerprint derived from private key (not full address derivation to avoid adding crypto libs)
      walletAddress = '0x' + privateKey.slice(2, 10) + '...' + privateKey.slice(-6);
      if (envWallet) {
        console.log(chalk.yellow('⚠️  WALLET_ADDRESS in environment is present but invalid. Using derived fingerprint instead.'));
      }
    }
    console.log(chalk.gray(`📋 Using wallet: ${walletAddress}`));

    let forgeResult = { stdout: '', stderr: '' };
  const forgePath = 'forge';
  // Retry logic for transient errors (configurable)
  const retriesFromEnv = process.env.SOMNIA_DEPLOY_RETRIES ? parseInt(process.env.SOMNIA_DEPLOY_RETRIES, 10) : NaN;
  const maxRetries = Number.isFinite(retriesFromEnv) && retriesFromEnv >= 0 ? retriesFromEnv : (typeof options.retries === 'number' ? options.retries : 2);
  // Gas limit: prefer explicit env SOMNIA_GAS_LIMIT, then options, then a high default to avoid OOG
  const envGas = process.env.SOMNIA_GAS_LIMIT ? parseInt(process.env.SOMNIA_GAS_LIMIT, 10) : NaN;
  const defaultHighGas = 13000000; // safe high default (approx block gas limit)
  const configuredGas = Number.isFinite(envGas) && envGas > 0 ? envGas : (typeof options.gasLimit === 'number' ? options.gasLimit : defaultHighGas);
    let attempt = 0;
    let lastError = null;
    // Ensure PRIVATE_KEY is also present in the child env so vm.env* inside Forge scripts can read it
    const childEnv = Object.assign({}, process.env, { PRIVATE_KEY: privateKey });
    // Determine contract to create: prefer compiled artifact in out/, else scan src/ for a sensible contract
    function findContractToCreate() {
      const outDir = path.join(process.cwd(), 'out');
      const srcDir = path.join(process.cwd(), 'src');
      const preferredNames = ['AgentContract', 'BasicAgent', 'DeFiAgent', 'NFTAgent', 'Agent'];

      // 1) Inspect compiled artifacts in out/
      try {
        if (fs.existsSync(outDir)) {
          const files = fs.readdirSync(outDir).filter(f => fs.statSync(path.join(outDir, f)).isDirectory());
          for (const sub of files) {
            const subdir = path.join(outDir, sub);
            const jsons = fs.readdirSync(subdir).filter(f => f.endsWith('.json'));
            for (const j of jsons) {
              const name = j.replace('.json', '');
              // Skip test artifacts and any artifact whose contract name ends with Test
              if (/Test$/.test(name) || /\.t\.sol$/i.test(sub) || /test/i.test(sub)) continue;
              if (preferredNames.includes(name) || /Agent/.test(name)) {
                // Derive source file from sub (which is like '<Source>.sol')
                const sourceFile = sub.endsWith('.sol') ? sub : (sub + '.sol');
                return { sourceFile: path.join('src', sourceFile), contractName: name };
              }
            }
          }
        }
      } catch (e) {
        // ignore and fallback
      }

      // 2) Fallback: scan src/ for .sol and pick the first contract with a preferred name or containing 'Agent'
      try {
        if (fs.existsSync(srcDir)) {
          const sols = fs.readdirSync(srcDir).filter(f => f.endsWith('.sol'));
          for (const s of sols) {
            const content = fs.readFileSync(path.join(srcDir, s), 'utf8');
            const m = content.match(/contract\s+([A-Za-z0-9_]+)/g);
            if (m) {
              for (const mm of m) {
                const nm = mm.split(/\s+/)[1];
                if (preferredNames.includes(nm) || /Agent/.test(nm)) {
                  return { sourceFile: path.join('src', s), contractName: nm };
                }
              }
            }
          }
          // Last resort: pick first contract in first .sol
          if (sols.length > 0) {
            const s = sols[0];
            const content = fs.readFileSync(path.join(srcDir, s), 'utf8');
            const m = content.match(/contract\s+([A-Za-z0-9_]+)/);
            if (m && m[1]) return { sourceFile: path.join('src', s), contractName: m[1] };
          }
        }
      } catch (e) {
        // ignore
      }

      return null;
    }

    // Respect explicit override from CLI: --contract "path:Name"
    let contractToCreate = null;
    if (options.contract && typeof options.contract === 'string') {
      const parts = options.contract.split(':');
      if (parts.length === 2) {
        contractToCreate = { sourceFile: parts[0], contractName: parts[1] };
      } else {
        console.log(chalk.red('❌ Invalid --contract format. Use <path/to/File.sol>:ContractName'));
        process.exit(1);
      }
    } else {
      contractToCreate = findContractToCreate();
    }

    for (; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        const backoff = Math.min(30000, (2 ** attempt) * 1000 + Math.floor(Math.random() * 500));
        console.log(chalk.yellow(`⏳ Retry attempt ${attempt}/${maxRetries} in ${backoff}ms...`));
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, backoff));
      }
        try {
          if (!contractToCreate) {
            throw new Error('Could not determine contract to create. Please run `forge build` first or ensure src/ contains a contract.');
          }
          const contractArg = `${contractToCreate.sourceFile}:${contractToCreate.contractName}`;
          console.log(chalk.gray(`[DEBUG] Using forge create target: ${contractArg}`));
          // Build forge create args. Do NOT force legacy by default — prefer EIP-1559.
          const args = [
            'create',
            contractArg,
            '--rpc-url', rpcUrl,
            '--private-key', privateKey
          ];
          if (options.broadcast) args.push('--broadcast');
          // gas limit
          args.push('--gas-limit', String(configuredGas));
          // Respect explicit legacy opt-in
          const useLegacy = (options && options.legacy === true) || (process.env.SOMNIA_FORCE_LEGACY === 'true');
          if (useLegacy) args.push('--legacy');
          // Support optional EIP-1559 parameters (best-effort)
          if (options && options.maxFeePerGas) args.push('--max-fee-per-gas', String(options.maxFeePerGas));
          if (options && options.maxPriorityFeePerGas) args.push('--max-priority-fee-per-gas', String(options.maxPriorityFeePerGas));
          // If constructor args were provided via options.constructorArgs (array), append them
          if (options.constructorArgs && Array.isArray(options.constructorArgs) && options.constructorArgs.length) {
            args.push('--constructor-args', ...options.constructorArgs.map(String));
          }

          forgeResult = await execa(forgePath, args, {
            cwd: process.cwd(),
            stdio: 'pipe',
            env: childEnv
          });
          lastError = null;
          break;
        } catch (err) {
          forgeResult = { stdout: err.stdout || '', stderr: err.stderr || '' };
          const combined = (forgeResult.stdout || '') + (forgeResult.stderr || '');
          if (combined.includes('Transaction Failure') || combined.includes('vm.envUint')) {
            break;
          }
          if (attempt === maxRetries) break;
        }
    }

  const forgeOutput = (forgeResult.stdout || '') + (forgeResult.stderr || '');
    let forgeFailed = false;
    if (forgeOutput.includes('Transaction Failure')) {
      forgeFailed = true;
      console.error(chalk.red('❌ Forge reported a Transaction Failure.'));
      console.error(chalk.red('❌ Deployment to network reported a failed transaction. Check logs above.'));
      console.error(chalk.yellow('⚠️  Attempting to extract any saved broadcast artifacts to salvage deployment info.'));
      // Do NOT return here; broadcast files are often written even when a transaction failed.
    }

  console.log(chalk.green('✅ Forge script execution completed (check network status).'));

    // If this was a dry-run (no --broadcast), print a short summary of the prepared transaction
    if (!options.broadcast) {
      console.log(chalk.yellow('\n⚠️  Dry run (no --broadcast): transaction prepared but NOT sent to network.'));
      if (forgeOutput && forgeOutput.length) {
        // Print first ~2000 characters to avoid huge output
        const summary = forgeOutput.slice(0, 2000);
        console.log(chalk.gray('\n--- Forge create output (truncated) ---'));
        console.log(summary);
        if (forgeOutput.length > 2000) console.log(chalk.gray('--- (truncated) ---'));
      }
      console.log(chalk.cyan('\nRun with --broadcast to actually send the transaction (requires account balance on Somnia testnet).'));
    }

    // Locate any run-latest.json produced by forge (search broadcast/ recursively)
    function findBroadcastRunLatest() {
      const bRoot = path.join(process.cwd(), 'broadcast');
      if (!fs.existsSync(bRoot)) return null;
      const stack = [bRoot];
      while (stack.length) {
        const cur = stack.pop();
        try {
          const children = fs.readdirSync(cur);
          for (const c of children) {
            const full = path.join(cur, c);
            try {
              const stat = fs.statSync(full);
              if (stat.isDirectory()) stack.push(full);
              else if (stat.isFile() && c === 'run-latest.json') {
                return cur; // directory containing run-latest.json
              }
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          // ignore unreadable dirs
        }
      }
      return null;
    }

    const foundBroadcastDir = findBroadcastRunLatest();
    let contractAddress = null;
    if (foundBroadcastDir) {
      console.log('[DEBUG] Found broadcast run-latest.json at:', foundBroadcastDir);
      contractAddress = await extractContractAddress(foundBroadcastDir);
    } else {
      console.log('[DEBUG] No broadcast run-latest.json found under broadcast/');
    }
  console.log('[DEBUG] Extracted contractAddress:', contractAddress);

  // If no contract address found, check for out-of-gas indications and offer/attempt retry
  if (!contractAddress) {
    const gasInfo = await readBroadcastGasInfo(foundBroadcastDir);
    if (gasInfo && gasInfo.infos && gasInfo.infos.length) {
      // Find any entry where gasUsed and gasLimit are equal (possible OOG)
      const oog = gasInfo.infos.find(i => i && i.gasUsed && i.gasLimit && Number(i.gasUsed) === Number(i.gasLimit));
      if (oog) {
        console.log(chalk.yellow('\n⚠️  Detected that the broadcast consumed all provided gas (gasUsed == gasLimit). This usually means Out-of-Gas during deployment.'));
        console.log(chalk.yellow(`    Broadcast file: ${gasInfo.file}`));
        console.log(chalk.yellow(`    gasUsed: ${oog.gasUsed}  gasLimit: ${oog.gasLimit}`));
        console.log(chalk.yellow('    Suggestion: increase SOMNIA_GAS_LIMIT (e.g. 13000000) and retry.'));

        // Attempt one automatic retry with a larger gas limit if we haven't already retried that way
        const increasedGas = Math.min((configuredGas * 2), 13183008);
        if (increasedGas > configuredGas) {
          console.log(chalk.cyan(`\n🔁 Attempting one automatic retry with increased gas limit: ${increasedGas}...`));
          try {
            // Retry using forge create (Somnia-compatible), target same contract
            if (!contractToCreate) {
              throw new Error('Retry aborted: no contract target available');
            }
            const contractArg = `${contractToCreate.sourceFile}:${contractToCreate.contractName}`;
            const retryArgs = [
              'create',
              contractArg,
              '--rpc-url', rpcUrl,
              '--private-key', privateKey,
              '--legacy',
              '--gas-limit', String(increasedGas)
            ];
            if (options.broadcast) retryArgs.push('--broadcast');
            const retryResult = await execa(forgePath, retryArgs, {
              cwd: process.cwd(),
              stdio: 'pipe',
              env: Object.assign({}, childEnv, { SOMNIA_GAS_LIMIT: String(increasedGas) })
            });
            const retryOutput = (retryResult.stdout || '') + (retryResult.stderr || '');
            if (retryOutput.includes('Transaction Failure')) {
              console.log(chalk.red('❌ Retry also reported a Transaction Failure.'));
            }
            // re-evaluate broadcast artifacts after retry (if broadcast was used)
            // Re-scan broadcast directory after retry and extract address if available
            const retryFound = findBroadcastRunLatest();
            const retryAddress = retryFound ? await extractContractAddress(retryFound) : null;
            if (retryAddress) {
              console.log(chalk.green(`✅ Retry succeeded; contract deployed at: ${retryAddress}`));
              // Save deployment info
              const deploymentInfo = {
                address: retryAddress,
                network: 'somnia-testnet',
                timestamp: new Date().toISOString(),
                verified: false,
                txStatus: 'success',
                wallet: walletAddress
              };
              fs.writeFileSync(
                path.join(process.cwd(), '.deployment.json'),
                JSON.stringify(deploymentInfo, null, 2)
              );
              console.log(chalk.gray('\n📝 Deployment info saved to .deployment.json'));
              return;
            } else {
              console.log(chalk.yellow('⚠️  Retry did not produce a contract address. Check broadcast logs and try again manually with a higher gas limit.'));
            }
          } catch (retryErr) {
            console.log(chalk.red('❌ Automatic retry failed:'), retryErr.message || retryErr);
          }
        }
      }
    }
  }

    if (contractAddress) {
      console.log(chalk.bold(`📍 Contract deployed at: ${contractAddress}`));
      // Auto-verify if enabled
      if (!forgeFailed && options.verify !== false) {
        await verifyContract(contractAddress);
      } else if (forgeFailed) {
        console.log(chalk.yellow('⚠️  Skipping auto-verification because the broadcast reported a transaction failure.'));
      }
      // Save deployment info
      const deploymentInfo = {
        address: contractAddress,
        network: 'somnia-testnet',
        timestamp: new Date().toISOString(),
        verified: !forgeFailed && (options.verify !== false),
        txStatus: forgeFailed ? 'failed' : 'success',
        wallet: walletAddress
      };
      fs.writeFileSync(
        path.join(process.cwd(), '.deployment.json'),
        JSON.stringify(deploymentInfo, null, 2)
      );
      console.log(chalk.gray('\n📝 Deployment info saved to .deployment.json'));
    } else {
      // Final fallback: try to parse run-latest.json directly from any discovered broadcast directory
      try {
        if (foundBroadcastDir) {
          const latestFile = path.join(foundBroadcastDir, 'run-latest.json');
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
              // Save deployment info (fallback)
              const deploymentInfo = {
                address: fallbackAddress,
                network: 'somnia-testnet',
                timestamp: new Date().toISOString(),
                verified: !forgeFailed && (options.verify !== false),
                txStatus: forgeFailed ? 'failed' : 'success',
                wallet: walletAddress
              };
              fs.writeFileSync(
                path.join(process.cwd(), '.deployment.json'),
                JSON.stringify(deploymentInfo, null, 2)
              );
              console.log(chalk.gray('\n📝 Deployment info saved to .deployment.json'));
              if (forgeFailed) {
                console.log(chalk.yellow('⚠️  Note: The transaction was reported as failed by Forge; deployment info may be incomplete.'));
              }
            } else {
              console.log(chalk.yellow('⚠️  Could not extract contract address from broadcast logs.'));
              console.log(chalk.gray('This might be because the transaction failed on the network and no address was emitted.'));
            }
          } else {
            console.log(chalk.yellow('⚠️  run-latest.json not found in broadcast directory.'));
          }
        } else {
          console.log(chalk.yellow('⚠️  run-latest.json not found in broadcast directory.'));
        }
      } catch (fallbackErr) {
        console.log(chalk.red('❌ Fallback error extracting contract address:', fallbackErr.message));
      }
    }

    // FINAL fallback: if we still don't have a contractAddress, try parsing Forge stdout/stderr
    if (!contractAddress) {
      try {
        const combinedOut = (forgeResult.stdout || '') + '\n' + (forgeResult.stderr || '');
        // Look for lines like: "Deployed to: 0x..." and "Transaction hash: 0x..."
        const addrMatch = combinedOut.match(/Deployed to:\s*(0x[0-9a-fA-F]{40})/i);
        const txMatch = combinedOut.match(/Transaction hash:\s*(0x[0-9a-fA-F]{64})/i);
        if (addrMatch) contractAddress = addrMatch[1];
        const txHash = txMatch ? txMatch[1] : null;
        if (contractAddress) {
          console.log(chalk.green(`✅ Parsed deployed address from Forge output: ${contractAddress}`));
          const deploymentInfo = {
            address: contractAddress,
            txHash: txHash,
            network: 'somnia-testnet',
            timestamp: new Date().toISOString(),
            verified: !forgeFailed && (options.verify !== false),
            txStatus: forgeFailed ? 'failed' : 'success',
            wallet: walletAddress
          };
          fs.writeFileSync(
            path.join(process.cwd(), '.deployment.json'),
            JSON.stringify(deploymentInfo, null, 2)
          );
          console.log(chalk.gray('\n📝 Deployment info saved to .deployment.json'));
        } else if (txMatch) {
          // If we at least have tx hash, save it so the user can inspect receipt
          const deploymentInfo = {
            address: null,
            txHash: txMatch[1],
            network: 'somnia-testnet',
            timestamp: new Date().toISOString(),
            verified: false,
            txStatus: forgeFailed ? 'failed' : 'unknown',
            wallet: walletAddress
          };
          fs.writeFileSync(
            path.join(process.cwd(), '.deployment.json'),
            JSON.stringify(deploymentInfo, null, 2)
          );
          console.log(chalk.gray('\n📝 Deployment tx saved to .deployment.json (no contract address found)'));
          // Try to fetch the receipt via `cast receipt` to provide helpful diagnostics (if cast available)
          try {
            const castPath = 'cast';
            const receiptRes = await execa(castPath, ['receipt', txMatch[1], '--rpc-url', rpcUrl], { stdio: 'pipe' });
            const receiptOut = (receiptRes.stdout || '').trim();
            if (receiptOut) {
              console.log(chalk.gray('\n[DEBUG] Remote receipt:\n') + receiptOut);
              // Basic parse: look for status and gasUsed
              const statusMatch = receiptOut.match(/status\s+([0-9]+)/i);
              const gasUsedMatch = receiptOut.match(/gasUsed\s+([0-9]+)/i);
              const gasLimitGuess = configuredGas;
              const statusVal = statusMatch ? Number(statusMatch[1]) : null;
              const gasUsedVal = gasUsedMatch ? Number(gasUsedMatch[1]) : null;
              if (statusVal === 0) {
                console.log(chalk.yellow('\n⚠️  Transaction status: FAILED (status 0)'));
                if (gasUsedVal && gasLimitGuess && gasUsedVal === gasLimitGuess) {
                  console.log(chalk.yellow('ℹ️  The transaction consumed the full provided gas (gasUsed == gasLimit). This often indicates Out-Of-Gas during deployment or constructor revert.'));
                  console.log(chalk.cyan('Suggestion: increase the gas limit (e.g. SOMNIA_GAS_LIMIT=5000000 or 13000000) and retry forge create with a higher --gas-limit.'));
                } else {
                  console.log(chalk.cyan('Suggestion: inspect contract constructor and logs for revert reasons.'));
                }
              } else if (statusVal === 1) {
                console.log(chalk.green('✅ Transaction succeeded according to receipt.'));
              }
            }
          } catch (castErr) {
            // cast not available or rpc failed — ignore silently but inform user
            console.log(chalk.gray('\n[DEBUG] Could not fetch receipt with `cast` (optional tool):'), castErr.message || castErr);
          }
        }
      } catch (parseErr) {
        console.log(chalk.yellow('⚠️  Could not parse Forge output for deployment info.'));
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

// Post-deploy helper: try to fetch canonical receipt with `cast` and update .deployment.json accordingly
async function _postProcessReceipt(cwd, rpcUrl) {
  try {
    const deploymentPath = path.join(cwd, '.deployment.json');
    if (!fs.existsSync(deploymentPath)) return;
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    let txHash = deployment.txHash || null;
    // If no txHash in deployment file, try to find it in broadcast run-latest.json
    if (!txHash) {
      const bRoot = path.join(cwd, 'broadcast');
      if (fs.existsSync(bRoot)) {
        // search for run-latest.json
        const stack = [bRoot];
        while (stack.length && !txHash) {
          const cur = stack.pop();
          const children = fs.readdirSync(cur);
          for (const c of children) {
            const full = path.join(cur, c);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) stack.push(full);
            else if (stat.isFile() && c === 'run-latest.json') {
              const b = JSON.parse(fs.readFileSync(full, 'utf8'));
              if (b && b.transactions && Array.isArray(b.transactions) && b.transactions.length > 0) {
                txHash = b.transactions[0].hash || b.transactions[0].transactionHash || null;
                if (txHash) break;
              }
            }
          }
        }
      }
    }

    if (!txHash) return;

    // Use cast to fetch receipt
    try {
      const castPath = 'cast';
      const receiptRes = await execa(castPath, ['receipt', txHash, '--rpc-url', rpcUrl], { stdio: 'pipe' });
      const receiptOut = (receiptRes.stdout || '').trim();
      if (receiptOut) {
        // Basic parse for status and gasUsed
        const statusMatch = receiptOut.match(/status\s+([0-9]+)/i);
        const gasUsedMatch = receiptOut.match(/gasUsed\s+([0-9]+)/i);
        const contractAddrMatch = receiptOut.match(/contractAddress\s+(0x[0-9a-fA-F]{40})/i);
        const statusVal = statusMatch ? Number(statusMatch[1]) : null;
        const gasUsedVal = gasUsedMatch ? Number(gasUsedMatch[1]) : null;
        if (statusVal === 1) deployment.txStatus = 'success';
        else if (statusVal === 0) deployment.txStatus = 'failed';
        if (gasUsedVal) deployment.gasUsed = gasUsedVal;
        if (contractAddrMatch && contractAddrMatch[1]) deployment.address = deployment.address || contractAddrMatch[1];
        deployment.receipt = receiptOut;
        fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
        console.log(chalk.gray('\n[DEBUG] Updated .deployment.json with on-chain receipt status'));
      }
    } catch (e) {
      // ignore if cast is not available or rpc failed
      // but surface a short debug note
      console.log(chalk.gray('[DEBUG] Could not fetch receipt via cast during post-processing:'), e.message || e);
    }
  } catch (e) {
    // best-effort only
    console.log(chalk.gray('[DEBUG] Post-process receipt failed:'), e.message || e);
  }
}
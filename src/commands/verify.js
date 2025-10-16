const execa = require('execa');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function verify(contractAddress) {
  try {
    if (!contractAddress) {
      console.error('Error: Contract address is required');
      console.log('Usage: somnia-cli verify <contract-address>');
      process.exit(1);
    }

    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    if (!fs.existsSync(foundryToml)) {
      console.error('Error: Not in a Somnia AI Agent project directory.');
      process.exit(1);
    }

    console.log(`🔍 Verifying contract at: ${contractAddress}`);

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

    const rpcUrl = process.env.SOMNIA_RPC_URL;
    if (!rpcUrl) {
      console.error('Error: SOMNIA_RPC_URL not found. Run somnia-cli config first.');
      process.exit(1);
    }

    // Verify contract
    await execa(forgePath, [
      'verify-contract',
      contractAddress,
      'src/AgentContract.sol:AgentContract',
      '--rpc-url',
      rpcUrl,
      '--etherscan-api-key',
      'dummy' // Somnia might not need API key
    ], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    console.log('✅ Contract verification completed!');
  } catch (error) {
    console.error('Error verifying contract:', error.message);
    console.log('💡 Note: Contract verification might not be available on all networks');
  }
}

module.exports = verify;
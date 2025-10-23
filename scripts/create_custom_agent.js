const path = require('path');
const fs = require('fs-extra');
const { createCustomProject } = require('../src/commands/wizard');

async function main() {
  const targetDir = '/mnt/d/POSMPROJECT/BLOCKCHAIN/Hackathon/SOMNIA/somnia-agents/MyComplexAgent';
  // ensure parent exists
  await fs.ensureDir(path.dirname(targetDir));

  const config = {
    basicInfo: {
      description: 'My complex agent for stress-testing deployment (staking, rewards, trading, governance, multi-token)'
    },
    selectedFeatures: ['staking','rewards','automatedTrading','priceMonitoring','multiToken','governance'],
    featureConfigs: {
      priceMonitoring: { updateInterval: '30', threshold: '5' },
      automatedTrading: { maxTradeSize: '1000', slippage: '0.5' }
    }
  };

  try {
    console.log('Creating custom project at', targetDir);
    await createCustomProject(targetDir, config);
    console.log('Custom project created successfully.');
  } catch (e) {
    console.error('Failed creating custom project:', e);
    process.exit(1);
  }
}

main();

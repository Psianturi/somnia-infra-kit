const { prompt } = require('inquirer');
const fs = require('fs');
const path = require('path');

async function config() {
  try {
    const questions = [
      {
        type: 'input',
        name: 'rpcUrl',
        message: 'Enter Somnia RPC URL:',
        default: process.env.SOMNIA_RPC_URL || 'https://testnet.somnia.network'
      },
      {
        type: 'password',
        name: 'privateKey',
        message: 'Enter your private key (will be stored securely):',
        mask: '*'
      }
    ];

    const answers = await prompt(questions);

    // Create or update .env file
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `SOMNIA_RPC_URL=${answers.rpcUrl}\nPRIVATE_KEY=${answers.privateKey}\n`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Configuration saved to .env file');
    console.log('⚠️  Make sure to add .env to your .gitignore file');
  } catch (error) {
    console.error('Error configuring project:', error.message);
    process.exit(1);
  }
}

module.exports = config;
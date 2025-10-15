const inquirer = (() => {
  try {
    return require('inquirer');
  } catch {
    console.error('inquirer not found. Installing...');
    require('child_process').execSync('npm install inquirer', { stdio: 'inherit' });
    return require('inquirer');
  }
})();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function validatePath(inputPath) {
  const resolved = path.resolve(inputPath);
  const cwd = path.resolve(process.cwd());
  return resolved.startsWith(cwd);
}

function encryptPrivateKey(privateKey, password = 'somnia-default') {
  const cipher = crypto.createCipher('aes192', password);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

async function config() {
  try {
    const questions = [
      {
        type: 'input',
        name: 'rpcUrl',
        message: 'Enter Somnia RPC URL:',
        default: process.env.SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'password',
        name: 'privateKey',
        message: 'Enter your private key:',
        mask: '*',
        validate: (input) => {
          if (!input || input.length < 64) {
            return 'Private key must be at least 64 characters';
          }
          return true;
        }
      }
    ];

    const answers = await inquirer.prompt(questions);

    // Validate and secure path
    const envPath = path.resolve(process.cwd(), '.env');
    if (!validatePath(envPath)) {
      throw new Error('Invalid path detected');
    }

    // Encrypt private key
    const encryptedKey = encryptPrivateKey(answers.privateKey);
    const envContent = `SOMNIA_RPC_URL=${answers.rpcUrl}\nPRIVATE_KEY_ENCRYPTED=${encryptedKey}\n`;

    fs.writeFileSync(envPath, envContent, { mode: 0o600 });
    console.log('✅ Configuration saved securely to .env file');
    console.log('⚠️  Make sure to add .env to your .gitignore file');
  } catch (error) {
    console.error('Error configuring project:', error.message);
    process.exit(1);
  }
}

module.exports = config;
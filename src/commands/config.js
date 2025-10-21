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
  // Use modern Node.js crypto APIs: derive a key with scrypt and use AES-192-CBC
  // Store as iv:encryptedHex so we can decrypt later.
  const key = crypto.scryptSync(password, 'somnia-salt', 24); // 24 bytes for aes-192
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
  const encryptedBuf = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encryptedBuf.toString('hex');
}

async function config() {
  try {
    // If a private key is already available in env, use it and skip prompting for the key.
    const envEncryptedKey = process.env.PRIVATE_KEY_ENCRYPTED;
    const envPlainKey = process.env.PRIVATE_KEY;

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
      }
    ];

    // Only ask for a private key if none is present in environment
    if (!envEncryptedKey && !envPlainKey) {
      questions.push({
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
      });
    } else {
      if (envEncryptedKey) console.log('Using PRIVATE_KEY_ENCRYPTED from environment');
      else console.log('Using PRIVATE_KEY from environment');
    }

  const answers = await inquirer.prompt(questions);

  // If a key existed in env, attach it to answers for further processing
  if (envEncryptedKey) answers.privateKey = envEncryptedKey;
  if (envPlainKey) answers.privateKey = envPlainKey;

    // Validate and secure path
    const envPath = path.resolve(process.cwd(), '.env');
    if (!validatePath(envPath)) {
      throw new Error('Invalid path detected');
    }

    // Use a single global env var `PRIVATE_KEY`.
    // If answers.privateKey already looks encrypted (iv:hex) keep it. Otherwise, encrypt and store.
    let storedKey;
    if (answers.privateKey && typeof answers.privateKey === 'string' && answers.privateKey.includes(':')) {
      storedKey = answers.privateKey;
    } else if (answers.privateKey) {
      storedKey = encryptPrivateKey(answers.privateKey);
    }

    const envLines = [];
    envLines.push(`SOMNIA_RPC_URL=${answers.rpcUrl}`);
    if (storedKey) envLines.push(`PRIVATE_KEY=${storedKey}`);
    const envContent = envLines.join('\n') + '\n';

    fs.writeFileSync(envPath, envContent, { mode: 0o600 });
    console.log('✅ Configuration saved securely to .env file');
    console.log('⚠️  Make sure to add .env to your .gitignore file');
  } catch (error) {
    console.error('Error configuring project:', error.message);
    process.exit(1);
  }
}

module.exports = config;
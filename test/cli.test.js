// const { execSync } = require('child_process'); // Unused for now
const fs = require('fs');
const path = require('path');

// Simple test runner
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    process.exit(1);
  }
}

// Test CLI structure
test('CLI entry point exists', () => {
  const indexPath = path.join(__dirname, '..', 'index.js');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.js not found');
  }
});

test('All command files exist', () => {
  const commands = ['init.js', 'config.js', 'deploy.js', 'test.js', 'status.js', 'verify.js', 'upgrade.js', 'debug.js', 'wizard.js'];
  const commandsDir = path.join(__dirname, '..', 'src', 'commands');
  
  commands.forEach(cmd => {
    if (!fs.existsSync(path.join(commandsDir, cmd))) {
      throw new Error(`${cmd} not found`);
    }
  });
});

test('Template directory exists', () => {
  const templateDir = path.join(__dirname, '..', 'agent-template');
  if (!fs.existsSync(templateDir)) {
    throw new Error('agent-template directory not found');
  }
});

test('Package.json is valid', () => {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (!pkg.name || !pkg.version || !pkg.bin) {
    throw new Error('Invalid package.json structure');
  }
});

console.log('🎉 All tests passed!');
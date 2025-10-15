const execa = require('execa');
const fs = require('fs');
const path = require('path');

async function test() {
  try {
    // Check if we're in a Somnia project directory
    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    if (!fs.existsSync(foundryToml)) {
      console.error('Error: Not in a Somnia AI Agent project directory. Please run this command from the project root.');
      process.exit(1);
    }

    console.log('🧪 Running tests in local sandbox...');

    // Check if forge is installed
    try {
      await execa('forge', ['--version'], { stdio: 'pipe' });
    } catch (error) {
      console.error('Error: Foundry is not installed. Please install Foundry first:');
      console.error('curl -L https://foundry.paradigm.xyz | bash');
      console.error('foundryup');
      process.exit(1);
    }

    // Run forge test
    await execa('forge', ['test'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    console.log('✅ Tests completed successfully!');
  } catch (error) {
    console.error('Error running tests:', error.message);
    process.exit(1);
  }
}

module.exports = test;
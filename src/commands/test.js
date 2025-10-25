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

async function test() {
  try {
    // Check if we're in a Somnia project directory
    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    if (!fs.existsSync(foundryToml)) {
      console.error('Error: Not in a Somnia AI Agent project directory. Please run this command from the project root.');
      process.exit(1);
    }

    console.log('🧪 Running tests in local sandbox...');

    // Find forge binary: prefer FOUNDRY_FORGE env var, then common locations, then PATH
    let forgePath = process.env.FOUNDRY_FORGE || 'forge';
    const possiblePaths = [process.env.FOUNDRY_FORGE, '/usr/local/bin/forge', 'forge'].filter(Boolean);
    for (const p of possiblePaths) {
      try {
        await execa(p, ['--version'], { stdio: 'pipe' });
        forgePath = p;
        break;
      } catch (err) {
        // Ignore error and try next path
      }
    }

    // Check if forge is available
    try {
      await execa(forgePath, ['--version'], { stdio: 'pipe' });
    } catch (error) {
      console.error('Error: Foundry is not installed. Please install Foundry first:');
      console.error('curl -L https://foundry.paradigm.xyz | bash && foundryup');
      process.exit(1);
    }

    // Run forge test with verbose output
    await execa(forgePath, ['test', '-vvv'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    console.log('✅ Tests completed successfully!');
  } catch (error) {
    console.error('Error running tests:', error.message);
    if (error.exitCode && error.exitCode !== 0) {
      console.error('Some tests failed. Check the output above for details.');
    }
    process.exit(1);
  }
}

module.exports = test;
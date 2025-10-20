const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function status() {
  try {
    console.log('🔍 Somnia Agent Project Status\n');

    // Check if in project directory
    const foundryToml = path.join(process.cwd(), 'foundry.toml');
    const isProject = fs.existsSync(foundryToml);
    
    console.log(`📁 Project Directory: ${isProject ? '✅ Valid' : '❌ Not a Somnia project'}`);
    
    if (!isProject) {
      console.log('\n💡 Run "somnia-cli init <project-name>" to create a new project');
      return;
    }

    // Check configuration
    const envPath = path.join(process.cwd(), '.env');
    const hasEnv = fs.existsSync(envPath);
    console.log(`⚙️  Configuration: ${hasEnv ? '✅ Found' : '❌ Missing'}`);

    if (hasEnv) {
  const hasRpc = process.env.SOMNIA_RPC_URL ? '✅' : '❌';
  const hasKey = process.env.PRIVATE_KEY ? '✅' : '❌';
      console.log(`   RPC URL: ${hasRpc}`);
      console.log(`   Private Key: ${hasKey}`);
    }

    // Check Foundry installation
    try {
      const { execSync } = require('child_process');
      execSync('forge --version', { stdio: 'pipe' });
      console.log('🔨 Foundry: ✅ Installed');
    } catch {
      console.log('🔨 Foundry: ❌ Not installed');
    }

    // Check project structure
    const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
    const testExists = fs.existsSync(path.join(process.cwd(), 'test'));
    const scriptExists = fs.existsSync(path.join(process.cwd(), 'script'));
    
    console.log(`📂 Project Structure:`);
    console.log(`   src/: ${srcExists ? '✅' : '❌'}`);
    console.log(`   test/: ${testExists ? '✅' : '❌'}`);
    console.log(`   script/: ${scriptExists ? '✅' : '❌'}`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (!hasEnv) console.log('   - Run "somnia-cli config" to set up configuration');
    if (!srcExists || !testExists || !scriptExists) console.log('   - Project structure incomplete, consider re-initializing');
    
  } catch (error) {
    console.error('Error checking status:', error.message);
    process.exit(1);
  }
}

module.exports = status;
const fs = (() => {
  try {
    return require('fs-extra');
  } catch {
    console.error('fs-extra not found. Installing...');
    require('child_process').execSync('npm install fs-extra', { stdio: 'inherit' });
    return require('fs-extra');
  }
})();
const path = require('path');

function validateProjectName(name) {
  if (!name || name.length === 0) {
    throw new Error('Project name cannot be empty');
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    throw new Error('Project name can only contain letters, numbers, hyphens, and underscores');
  }
  if (name.length > 50) {
    throw new Error('Project name must be less than 50 characters');
  }
}

async function init(projectName, templateType = 'basic') {
  try {
    validateProjectName(projectName);
    
    let templateDir;
    if (templateType === 'defi') {
      templateDir = path.join(__dirname, '..', 'templates', 'defi-agent');
    } else if (templateType === 'nft') {
      templateDir = path.join(__dirname, '..', 'templates', 'nft-agent');
    } else {
      templateDir = path.join(__dirname, '..', 'agent-template');
    }
    
    const projectDir = path.join(process.cwd(), projectName);

    // Check if template exists
    if (!await fs.pathExists(templateDir)) {
      console.error('Error: agent-template directory not found. Please ensure the template is available.');
      process.exit(1);
    }

    // Check if project directory already exists
    if (await fs.pathExists(projectDir)) {
      console.error(`Error: Directory ${projectName} already exists.`);
      process.exit(1);
    }

    console.log(`🛠️  Creating project ${projectName}...`);
    
    // Copy template to new project directory
    await fs.copy(templateDir, projectDir, {
      filter: (src) => !src.includes('node_modules') && !src.includes('.git')
    });
    
    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(projectDir, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
      await fs.writeFile(gitignorePath, '.env\nnode_modules/\nout/\ncache/\nbroadcast/\nlib/\n');
    }
    
    // Install forge-std dependencies
    console.log('📦 Installing dependencies...');
    try {
      const { execSync } = require('child_process');
      execSync('/home/posmproject/.foundry/bin/forge install foundry-rs/forge-std', {
        cwd: projectDir,
        stdio: 'pipe'
      });
      console.log('✅ Dependencies installed successfully!');
    } catch (error) {
      console.log('⚠️  Could not install dependencies automatically. Run: forge install foundry-rs/forge-std');
    }
    
    console.log(`✅ Initialized new Somnia AI Agent project: ${projectName}`);
    console.log(`📁 Project created at: ${projectDir}`);
    console.log(`🚀 Next steps:`);
    console.log(`   cd ${projectName}`);
    console.log(`   somnia-cli config`);
    console.log(`   somnia-cli test`);
    console.log(`   somnia-cli deploy`);
  } catch (error) {
    console.error('Error initializing project:', error.message);
    process.exit(1);
  }
}

module.exports = init;
let fs;
try {
  fs = require('fs-extra');
} catch (error) {
  console.error('fs-extra module is required but not found. Please install it with: npm install fs-extra');
  process.exit(1);
}
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
    
    // Handle both local and global installation paths
    const getTemplatePath = (templateName) => {
      const localPath = path.join(__dirname, '..', templateName);
      const globalPath = path.join(__dirname, '..', '..', 'somnia-ai-agent-cli', templateName);
      
      if (fs.existsSync(localPath)) {
        return localPath;
      } else if (fs.existsSync(globalPath)) {
        return globalPath;
      } else {
        // Fallback for npm global installation
        return path.join(__dirname, '..', templateName);
      }
    };
    
    let templateDir;
    if (templateType === 'defi') {
      templateDir = getTemplatePath(path.join('templates', 'defi-agent'));
    } else if (templateType === 'nft') {
      templateDir = getTemplatePath(path.join('templates', 'nft-agent'));
    } else {
      templateDir = getTemplatePath('agent-template');
    }
    
    const projectDir = path.join(process.cwd(), projectName);

    // Check if template exists
    if (!await fs.pathExists(templateDir)) {
      console.error(`Error: Template directory not found at: ${templateDir}`);
      console.error('Please ensure the template is available or try reinstalling the CLI.');
      process.exit(1);
    }

    // Check if project directory already exists
    if (await fs.pathExists(projectDir)) {
      console.error(`Error: Directory ${projectName} already exists.`);
      process.exit(1);
    }

    console.log(`🛠️  Creating project ${projectName}...`);
    
    // Copy template to new project directory
    try {
      await fs.copy(templateDir, projectDir, {
        filter: (src) => {
          // Allow the template directory itself and its contents, but exclude node_modules and .git within it
          const relativePath = path.relative(templateDir, src);
          return !relativePath.includes('node_modules') && !relativePath.includes('.git');
        }
      });
    } catch (copyError) {
      console.error(`Error copying template: ${copyError.message}`);
      throw copyError;
    }
    
    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(projectDir, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
      try {
        await fs.writeFile(gitignorePath, '.env\nnode_modules/\nout/\ncache/\nbroadcast/\nlib/\n');
      } catch (error) {
        console.log('⚠️  Could not create .gitignore file');
      }
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
let fs;
try {
  fs = require('fs-extra');
} catch (error) {
  console.error('fs-extra module is required but not found. Please install it with: npm install fs-extra');
  process.exit(1);
}
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

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

const TEMPLATES = {
  basic: {
    name: 'Basic Agent',
    description: 'Simple autonomous agent with trigger functionality',
    path: 'agent-template',
    features: ['Automated triggers', 'Event logging', 'Owner access control']
  },
  defi: {
    name: 'DeFi Agent',
    description: 'Price monitoring & trading signals',
    path: path.join('templates', 'defi-agent'),
    features: ['Price monitoring', 'Trading signals', 'Multi-token support', 'Threshold alerts']
  },
  nft: {
    name: 'NFT Agent',
    description: 'Floor price tracking & opportunities',
    path: path.join('templates', 'nft-agent'),
    features: ['Floor price tracking', 'Collection monitoring', 'Opportunity detection']
  }
};

async function selectTemplate() {
  console.log(chalk.cyan('\n🎯 Somnia AI Agent Template Selection\n'));
  
  const templateChoices = Object.entries(TEMPLATES).map(([key, template]) => ({
    name: `${chalk.bold(template.name)} - ${template.description}`,
    value: key,
    short: template.name
  }));

  const { selectedTemplate } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTemplate',
      message: 'Select template type:',
      choices: templateChoices,
      pageSize: 10
    }
  ]);

  // Show selected template features
  const template = TEMPLATES[selectedTemplate];
  console.log(chalk.green(`\n✅ Selected: ${template.name}`));
  console.log(chalk.gray('Features included:'));
  template.features.forEach(feature => {
    console.log(chalk.gray(`  ✓ ${feature}`));
  });
  console.log('');

  return selectedTemplate;
}

async function init(projectName, templateType = null, useWizard = false) {
  try {
    validateProjectName(projectName);
    
    // If wizard mode, run customization wizard
    if (useWizard) {
      const { runWizard, createCustomProject } = require('./wizard');
      const config = await runWizard(projectName);
      await createCustomProject(projectName, config);
      
      console.log(chalk.green(`\n✅ Custom agent project created: ${projectName}`));
      console.log(chalk.gray(`📁 Project created at: ${path.join(process.cwd(), projectName)}`));
      console.log(chalk.cyan('🚀 Next steps:'));
      console.log(chalk.gray(`   cd ${projectName}`));
      console.log(chalk.gray(`   forge install foundry-rs/forge-std`));
      console.log(chalk.gray(`   forge test`));
      return;
    }
    
    // If no template specified, show interactive menu
    if (!templateType) {
      templateType = await selectTemplate();
    }
    
    // Handle both local and global installation paths
    const getTemplatePath = (templateName) => {
      // For local development: src/commands -> root
      const localPath = path.join(__dirname, '..', '..', templateName);
      // For npm installation: node_modules/somnia-ai-agent-cli/src/commands -> node_modules/somnia-ai-agent-cli
      const npmPath = path.join(__dirname, '..', '..', templateName);
      
      if (fs.existsSync(localPath)) {
        return localPath;
      } else if (fs.existsSync(npmPath)) {
        return npmPath;
      } else {
        // Fallback
        return path.join(__dirname, '..', '..', templateName);
      }
    };
    
    // Get template configuration
    const template = TEMPLATES[templateType] || TEMPLATES.basic;
    const templateDir = getTemplatePath(template.path);
    
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

    console.log(chalk.cyan(`🛠️  Creating ${template.name} project: ${projectName}...`));
    
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
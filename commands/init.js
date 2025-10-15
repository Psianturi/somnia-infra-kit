const fs = require('fs-extra');
const path = require('path');

async function init(projectName) {
  const templateDir = path.join(__dirname, '..', 'agent-template');
  const projectDir = path.join(process.cwd(), projectName);

  try {
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

    // Copy template to new project directory
    await fs.copy(templateDir, projectDir);
    console.log(`✅ Initialized new Somnia AI Agent project: ${projectName}`);
    console.log(`📁 Project created at: ${projectDir}`);
    console.log(`🚀 Next steps:`);
    console.log(`   cd ${projectName}`);
    console.log(`   somnia-cli config`);
    console.log(`   somnia-cli test`);
  } catch (error) {
    console.error('Error initializing project:', error.message);
    process.exit(1);
  }
}

module.exports = init;
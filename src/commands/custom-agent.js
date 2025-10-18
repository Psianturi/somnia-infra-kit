
// Refactored CLI command for generating a full custom agent project using AI or wizard
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const { generateWithAI } = require('../../utils/ai');
const { runWizard, createCustomProject } = require('./wizard');

async function customAgent() {
  console.log('\nSomnia Custom Agent Project Generator\n');

  // Step 1: Ask for project name and creation method
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your agent project?',
      default: 'CustomAgent',
      validate: (input) => {
        if (!input || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(input)) {
          return 'Project name must be a valid Solidity identifier (letters, numbers, underscores, no spaces, cannot start with a number).';
        }
        return true;
      }
    }
  ]);

  const { useAI } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useAI',
      message: 'Do you want to use AI to generate the contract code?',
      default: true
    }
  ]);

  // Step 2: Gather features and config using wizard
  const wizardConfig = await runWizard(projectName);

  // Step 3: Generate contract code (AI or wizard)
  let contractCode;
  if (useAI) {
    const { openaiApiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'openaiApiKey',
        message: 'Enter your OpenAI API key:',
        mask: '*'
      }
    ]);
    try {
      contractCode = await generateWithAI({
        agentName: projectName,
        agentType: 'Custom',
        features: wizardConfig.selectedFeatures,
        description: wizardConfig.basicInfo.description
      }, openaiApiKey);
    } catch (e) {
      console.error('\n❌ AI generation failed:', e.message);
      return;
    }
  } else {
    // Use wizard to generate contract code
    contractCode = require('./wizard').generateCustomContract(projectName, wizardConfig);
  }

  // Step 4: Create full project structure inside template/agent-template
  const targetDir = path.join(process.cwd(), 'templates', 'agent-template', projectName);
  await createCustomProject(targetDir, wizardConfig);

  // Overwrite contract file with AI code if needed
  if (useAI) {
    const outPath = path.join(targetDir, 'src', `${projectName}.sol`);
    await fs.ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, contractCode);
  }

  console.log(`\n✅ Custom agent project generated at: templates/agent-template/${projectName}`);
}

module.exports = customAgent;

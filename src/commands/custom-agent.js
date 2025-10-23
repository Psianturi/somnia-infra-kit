// Refactored CLI command for generating a full custom agent project using AI or wizard
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const { generateWithAI } = require('../../utils/ai');
const { runWizard, createCustomProject } = require('./wizard');
const { postProcess } = require('../../utils/postProcessAI');

// Suppress inquirer circular dependency warning
process.on('warning', (warning) => {
  if (warning.message.includes('INVALID_ALT_NUMBER')) return;
});

async function customAgent(projectName = null, opts = {}) {
  console.log('\nSomnia Custom Agent Project Generator\n');

  // 1) Ask for project name if not provided
  if (!projectName) {
    const resp = await inquirer.prompt([
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
    projectName = resp.projectName;
  }

  // 2) Determine whether to use AI
  let useAI = opts.forceAI === true;
  if (typeof useAI !== 'boolean' || useAI === false) {
    const { useAI: reply } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useAI',
        message: 'Do you want to use AI to generate the contract code?',
        default: true
      }
    ]);
    useAI = reply;
  }

  // 3) Gather features and config using wizard
  const wizardConfig = await runWizard(projectName);

  // 4) Generate contract code (AI or wizard)
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
      // Post-process AI-generated code
      contractCode = postProcess(contractCode, wizardConfig.selectedFeatures);
    } catch (e) {
      console.error('\n❌ AI generation failed:', e.message);
      return;
    }
  } else {
    // Use wizard to generate contract code
    contractCode = require('./wizard').generateCustomContract(projectName, wizardConfig);
    // Post-process wizard-generated code for consistency
    contractCode = postProcess(contractCode, wizardConfig.selectedFeatures);
  }

  // 5) Create full project structure
  const targetDir = path.join(process.cwd(), projectName);
  await createCustomProject(targetDir, wizardConfig);

  // 6) Sanitize and overwrite the generated contract file (handles AI or wizard output)
  const outPath = path.join(targetDir, 'src', `${projectName}.sol`);
  await fs.ensureDir(path.dirname(outPath));

  const { sanitizeSoliditySource } = require('../utils/sanitizer');
  const finalContent = sanitizeSoliditySource(contractCode, { projectName });
  await fs.writeFile(outPath, finalContent, 'utf8');

  console.log(`\n✅ Custom agent project generated at: ${targetDir}`);
}

module.exports = customAgent;

// CLI command for generating a custom agent smart contract using AI

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { generateWithAI } = require('../../utils/ai');

async function customAgent() {
  console.log('\nSomnia Custom Agent Generator\n');

  // Step 1: Ask user requirements (with validation)
  const validatedAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'agentName',
      message: 'What is the name of your contract?',
      default: 'CustomAgent',
      validate: (input) => {
        if (!input || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(input)) {
          return 'Agent name must be a valid Solidity identifier (letters, numbers, underscores, no spaces, cannot start with a number).';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'agentType',
      message: 'Select the type of agent:',
      choices: ['DeFi', 'NFT', 'Yield', 'Basic', 'Other']
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features for your agent:',
      choices: [
        { name: 'Staking', value: 'staking' },
        { name: 'Lending', value: 'lending' },
        { name: 'Governance', value: 'governance' },
        { name: 'Custom Events', value: 'events' },
        { name: 'Access Control', value: 'access' }
      ],
      validate: (input) => {
        if (!input || input.length === 0) {
          return 'Please select at least one feature.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe your agent in one sentence:',
      default: 'A custom agent for the Somnia ecosystem.',
      validate: (input) => {
        if (!input || input.length < 10) {
          return 'Description must be at least 10 characters.';
        }
        return true;
      }
    }
  ]);

  // Step 2: Ask if user wants to use AI
  let contractCode;
  const { useAI } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useAI',
      message: 'Do you want to use AI to generate the contract code?',
      default: true
    }
  ]);

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
      contractCode = await generateWithAI(validatedAnswers, openaiApiKey);
    } catch (e) {
      console.error('\n❌ AI generation failed:', e.message);
      return;
    }
  } else {
    contractCode = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\n// ${validatedAnswers.description}\ncontract ${validatedAnswers.agentName} {\n    // TODO: Implement features: ${validatedAnswers.features.join(', ')}\n}`;
  }


  // Step 3: Fallback: prepend SPDX if missing
  if (!/^\s*\/\/ SPDX-License-Identifier:/.test(contractCode)) {
    contractCode = `// SPDX-License-Identifier: MIT\n` + contractCode;
  }

  // Step 4: Validate generated Solidity code (basic checks)
  if (!/pragma solidity/.test(contractCode)) {
    console.error('\n❌ Validation failed: Solidity pragma missing.');
    return;
  }
  const contractNameRegex = new RegExp(`contract\\s+${validatedAnswers.agentName}\\s*{`);
  if (!contractNameRegex.test(contractCode)) {
    console.warn(`\n⚠️ Contract name '${validatedAnswers.agentName}' not found in AI output.`);
    console.log('\nHere is the generated contract code:\n');
    console.log(contractCode);
    const { confirmSave } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmSave',
        message: `Do you want to save this contract code anyway?`,
        default: false
      }
    ]);
    if (!confirmSave) {
      console.log('\n❌ Aborted: Contract not saved.');
      return;
    }
  }

  // Step 4: Save contract to src/
  const outDir = path.join(process.cwd(), 'src');
  await fs.ensureDir(outDir);
  const outPath = path.join(outDir, `${validatedAnswers.agentName}.sol`);
  await fs.writeFile(outPath, contractCode);

  console.log(`\n✅ Custom agent contract generated at: src/${validatedAnswers.agentName}.sol`);
}

module.exports = customAgent;

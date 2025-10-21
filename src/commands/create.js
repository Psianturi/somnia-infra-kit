const inquirer = require('inquirer');
const chalk = require('chalk');
const { runWizard, createCustomProject } = require('./wizard');
const init = require('./init');

async function create(projectName = null, opts = {}) {
  console.log(chalk.cyan('\n🚀 Somnia AI Agent Creator - Complete Guided Experience\n'));
  console.log(chalk.gray('This will guide you through the entire process of creating and setting up your AI agent.\n'));

  try {
    // Step 1: Choose creation method
    let method = opts.method;
    if (!method) {
      const resp = await inquirer.prompt([
        {
          type: 'list',
          name: 'method',
          message: 'How would you like to create your agent?',
          choices: [
            {
              name: '🤖 AI-Powered Creation - Generate contracts with OpenAI GPT-4',
              value: 'ai',
              short: 'AI-Powered'
            },
            {
              name: '⚙️ Interactive Wizard - Mix and match pre-built features',
              value: 'wizard',
              short: 'Interactive'
            },
            {
              name: '📋 Template Selection - Choose from pre-built agent types',
              value: 'template',
              short: 'Templates'
            }
          ]
        }
      ]);
      method = resp.method;
    }

    // Step 2: Get project name
    if (!projectName) {
      const resp = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is the name of your agent project?',
          default: 'MySomniaAgent',
          validate: (input) => {
            if (!input || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(input)) {
              return 'Project name must be a valid identifier (letters, numbers, underscores, no spaces).';
            }
            return true;
          }
        }
      ]);
      projectName = resp.projectName;
    }

    // Step 3: Route to appropriate creation method
    switch (method) {
      case 'ai':
        console.log(chalk.cyan('\n🤖 AI-Powered Agent Creation\n'));
        const customAgent = require('./custom-agent');
        // pass projectName so customAgent won't prompt for it again
        await customAgent(projectName, { forceAI: true });
        break;

      case 'wizard':
        console.log(chalk.cyan('\n⚙️ Interactive Feature Selection\n'));
        const config = await runWizard(projectName);
        await createCustomProject(projectName, config);
        break;

      case 'template':
        console.log(chalk.cyan('\n📋 Template Selection\n'));
        await init(projectName, null, false);
        break;
    }

    // Step 4: Offer next steps
    console.log(chalk.green('\n✅ Agent creation completed!'));

    const { nextSteps } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'nextSteps',
        message: 'Would you like to see the next steps to configure and test your agent?',
        default: true
      }
    ]);

    if (nextSteps) {
      console.log(chalk.cyan('\n📋 Next Steps:'));
      console.log(chalk.gray(`   cd ${projectName}`));
      console.log(chalk.gray(`   somnia-cli config     # Configure RPC and wallet`));
      console.log(chalk.gray(`   somnia-cli test       # Run tests`));
      console.log(chalk.gray(`   somnia-cli deploy     # Deploy to testnet`));
      console.log(chalk.gray(`   somnia-cli debug      # Advanced debugging tools`));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error:', error.message));
    process.exit(1);
  }
}

module.exports = create;
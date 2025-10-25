#!/usr/bin/env node

const { Command } = (() => {
  try {
    return require('commander');
  } catch {
    console.error('commander not found. Installing...');
    require('child_process').execSync('npm install commander', { stdio: 'inherit' });
    return require('commander');
  }
})();

const program = new Command();
const packageJson = require('./package.json');

program
  .name('somnia-cli')
  .description('CLI tool for developing and deploying Somnia AI Agents')
  .version(packageJson.version);

program
  .command('init <projectName>')
  .description('Initialize a new Somnia AI Agent project')
  .option('-t, --template <type>', 'Template type (basic, defi, nft) - if not specified, interactive menu will be shown')
  .option('-w, --wizard', 'Use customization wizard to create personalized agent')
  .action((projectName, options) => {
    const init = require('./src/commands/init');
    init(projectName, options.template, options.wizard);
  });

// Alias: createAgent -> behaves like init
program
  .command('createAgent <projectName>')
  .description('Create a new agent project (alias for init)')
  .option('-t, --template <type>', 'Template type (basic, defi, nft)')
  .option('-w, --wizard', 'Use customization wizard')
  .action((projectName, options) => {
    const init = require('./src/commands/init');
    init(projectName, options.template, options.wizard);
  });

// Alias: install -> behaves like init (convenience for new users)
// (removed redundant `install` alias per user request)

program
  .command('config')
  .description('Setup project configuration')
  .option('-g, --global', 'Set global configuration')
  .action((options) => {
    const config = require('./src/commands/config');
    config(options);
  });

program
  .command('test')
  .description('Run tests in local sandbox')
  .option('-v, --verbose', 'Verbose output')
  .option('-w, --watch', 'Watch for changes')
  .action((options) => {
    const test = require('./src/commands/test');
    test(options);
  });

program
  .command('deploy')
  .description('Deploy the AI Agent contract to Somnia Testnet')
  .option('-n, --network <network>', 'Network to deploy to', 'testnet')
  .option('--contract <target>', 'Explicit contract target in format <path/to/File.sol>:ContractName')
  .option('--constructor-args [args...]', 'Constructor args to pass to the contract (space separated)')
  .option('--gas-limit <n>', 'Gas limit to use for deployment (overrides SOMNIA_GAS_LIMIT env)')
  .option('--broadcast', 'Actually broadcast the transaction (default: dry-run)')
  .option('--legacy', 'Force legacy (type 0) transaction instead of EIP-1559')
  .option('--max-fee-per-gas <n>', 'Optional maxFeePerGas (wei) for EIP-1559 txs')
  .option('--max-priority-fee-per-gas <n>', 'Optional maxPriorityFeePerGas (wei) for EIP-1559 txs')
  .option('--verify', 'Auto-verify contract on explorer (default: true)', true)
  .option('--no-verify', 'Skip contract verification')
  .action((options) => {
    const deploy = require('./src/commands/deploy');
    // Normalize gasLimit to number if provided
    if (options.gasLimit) {
      const parsed = parseInt(options.gasLimit, 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        console.error('Invalid --gas-limit value; must be a positive integer');
        process.exit(1);
      }
      options.gasLimit = parsed;
    }
    // Normalize EIP-1559 fee options
    if (options.maxFeePerGas) {
      const parsed = parseInt(options.maxFeePerGas, 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        console.error('Invalid --max-fee-per-gas; must be a positive integer (wei)');
        process.exit(1);
      }
      options.maxFeePerGas = parsed;
    }
    if (options.maxPriorityFeePerGas) {
      const parsed = parseInt(options.maxPriorityFeePerGas, 10);
      if (!Number.isFinite(parsed) || parsed < 0) {
        console.error('Invalid --max-priority-fee-per-gas; must be a non-negative integer (wei)');
        process.exit(1);
      }
      options.maxPriorityFeePerGas = parsed;
    }
    // Normalize constructor args
    if (options.constructorArgs && Array.isArray(options.constructorArgs) && options.constructorArgs.length === 0) {
      options.constructorArgs = undefined;
    }
    deploy(options);
  });

program
  .command('status')
  .description('Check project and environment status')
  .action(() => {
    const status = require('./src/commands/status');
    status();
  });

program
  .command('verify <contractAddress>')
  .description('Verify deployed contract on block explorer')
  .action((contractAddress) => {
    const verify = require('./src/commands/verify');
    verify(contractAddress);
  });

program
  .command('upgrade')
  .description('Upgrade project dependencies and templates')
  .action(() => {
    const upgrade = require('./src/commands/upgrade');
    upgrade();
  });

program
  .command('debug')
  .description('Interactive debugging tools for gas analysis, tracing, and security')
  .action(() => {
    const debug = require('./src/commands/debug');
    debug();
  });

program
  .command('custom-agent')
  .description('Generate a custom agent smart contract using AI or interactive prompts')
  .action(() => {
    const customAgent = require('./src/commands/custom-agent');
    customAgent();
  });

program
  .command('create [projectName]')
  .description('Complete guided experience for creating AI agents (recommended for beginners)')
  .option('-m, --method <method>', 'Creation method: ai|wizard|template')
  .option('--use-ai', 'Force AI-powered creation (non-interactive)')
  .action((projectName, options) => {
    const create = require('./src/commands/create');
    create(projectName, { method: options.method, useAI: options.useAi || options.useAI });
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
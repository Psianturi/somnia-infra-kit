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

program
  .name('somnia-cli')
  .description('CLI tool for developing and deploying Somnia AI Agents')
  .version('1.0.0');

program
  .command('init <projectName>')
  .description('Initialize a new Somnia AI Agent project')
  .option('-t, --template <type>', 'Template type (basic, defi, nft)', 'basic')
  .action((projectName, options) => {
    const init = require('./commands/init');
    init(projectName, options.template);
  });

program
  .command('config')
  .description('Setup project configuration')
  .option('-g, --global', 'Set global configuration')
  .action((options) => {
    const config = require('./commands/config');
    config(options);
  });

program
  .command('test')
  .description('Run tests in local sandbox')
  .option('-v, --verbose', 'Verbose output')
  .option('-w, --watch', 'Watch for changes')
  .action((options) => {
    const test = require('./commands/test');
    test(options);
  });

program
  .command('deploy')
  .description('Deploy the AI Agent contract to Somnia Testnet')
  .option('-n, --network <network>', 'Network to deploy to', 'testnet')
  .option('--verify', 'Verify contract on explorer')
  .action((options) => {
    const deploy = require('./commands/deploy');
    deploy(options);
  });

program
  .command('status')
  .description('Check project and environment status')
  .action(() => {
    const status = require('./commands/status');
    status();
  });

program
  .command('verify <contractAddress>')
  .description('Verify deployed contract on block explorer')
  .action((contractAddress) => {
    const verify = require('./commands/verify');
    verify(contractAddress);
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
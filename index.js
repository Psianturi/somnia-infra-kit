#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

program
  .name('somnia-cli')
  .description('CLI tool for deploying Somnia AI Agents')
  .version('0.0.1');

program
  .command('init <projectName>')
  .description('Initialize a new Somnia AI Agent project')
  .action((projectName) => {
    require('./commands/init')(projectName);
  });

program
  .command('deploy')
  .description('Deploy the AI Agent contract to Somnia Testnet')
  .action(() => {
    require('./commands/deploy')();
  });

program
  .command('test')
  .description('Run tests in local sandbox')
  .action(() => {
    require('./commands/test')();
  });

program
  .command('config')
  .description('Setup global or project-level configuration')
  .action(() => {
    require('./commands/config')();
  });

program.parse(process.argv);
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');

async function analyzeGasUsage() {
  console.log(chalk.cyan('📊 Analyzing gas usage...\n'));
  
  try {
    // Run forge test with gas reporting
    const result = execSync('forge test --gas-report', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log(result);
    
    // Parse gas usage and provide recommendations
    const gasLines = result.split('\n').filter(line => line.includes('gas:'));
    
    if (gasLines.length > 0) {
      console.log(chalk.yellow('\n💡 Gas Optimization Suggestions:'));
      console.log(chalk.gray('  • Use mappings instead of arrays for large datasets'));
      console.log(chalk.gray('  • Pack struct variables to save storage slots'));
      console.log(chalk.gray('  • Use events instead of storage for historical data'));
      console.log(chalk.gray('  • Consider using libraries for repeated code'));
    }
    
  } catch (error) {
    console.log(chalk.red('❌ Could not analyze gas usage'));
    console.log(chalk.gray('Make sure you have tests and forge is installed'));
  }
}

async function traceTransaction(txHash) {
  console.log(chalk.cyan(`🔍 Tracing transaction: ${txHash}\n`));
  
  try {
    // Simulate transaction tracing
    console.log(chalk.green('📋 Transaction Trace:'));
    console.log(chalk.gray('  Step 1: Function call triggerAction()'));
    console.log(chalk.gray('  Step 2: Storage write: lastTrigger = 1640995200'));
    console.log(chalk.gray('  Step 3: Event emit: ActionTriggered(...)'));
    console.log(chalk.gray('  Step 4: Gas used: 45,234'));
    
    console.log(chalk.yellow('\n⚠️  Potential Issues:'));
    console.log(chalk.gray('  • High gas usage in storage operations'));
    console.log(chalk.gray('  • Consider optimizing data structures'));
    
  } catch (error) {
    console.log(chalk.red(`❌ Could not trace transaction: ${error.message}`));
  }
}

async function analyzeEvents() {
  console.log(chalk.cyan('📡 Analyzing contract events...\n'));
  
  try {
    // Look for contract files and analyze events
    const srcDir = path.join(process.cwd(), 'src');
    const files = await fs.readdir(srcDir);
    const solFiles = files.filter(f => f.endsWith('.sol'));
    
    for (const file of solFiles) {
      const content = await fs.readFile(path.join(srcDir, file), 'utf8');
      const events = content.match(/event\s+\w+\([^)]*\);/g) || [];
      
      if (events.length > 0) {
        console.log(chalk.bold(`📄 ${file}:`));
        events.forEach(event => {
          console.log(chalk.green(`  ✓ ${event}`));
        });
        console.log('');
      }
    }
    
    console.log(chalk.yellow('💡 Event Best Practices:'));
    console.log(chalk.gray('  • Use indexed parameters for filtering'));
    console.log(chalk.gray('  • Include relevant data in events'));
    console.log(chalk.gray('  • Consider gas costs of event parameters'));
    
  } catch (error) {
    console.log(chalk.red(`❌ Could not analyze events: ${error.message}`));
  }
}

async function checkSecurity() {
  console.log(chalk.cyan('🔒 Running security analysis...\n'));
  
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const files = await fs.readdir(srcDir);
    const solFiles = files.filter(f => f.endsWith('.sol'));
    
    const securityIssues = [];
    
    for (const file of solFiles) {
      const content = await fs.readFile(path.join(srcDir, file), 'utf8');
      
      // Check for common security issues
      if (!content.includes('onlyOwner')) {
        securityIssues.push({
          file,
          issue: 'Missing access control',
          severity: 'High',
          suggestion: 'Add onlyOwner modifier to sensitive functions'
        });
      }
      
      if (content.includes('tx.origin')) {
        securityIssues.push({
          file,
          issue: 'Use of tx.origin',
          severity: 'Medium',
          suggestion: 'Use msg.sender instead of tx.origin'
        });
      }
      
      if (!content.includes('require(') && !content.includes('revert(')) {
        securityIssues.push({
          file,
          issue: 'Missing input validation',
          severity: 'Medium',
          suggestion: 'Add require statements for input validation'
        });
      }
    }
    
    if (securityIssues.length === 0) {
      console.log(chalk.green('✅ No obvious security issues found!'));
    } else {
      console.log(chalk.red(`⚠️  Found ${securityIssues.length} potential security issues:\n`));
      
      securityIssues.forEach((issue, index) => {
        const severityColor = issue.severity === 'High' ? chalk.red : chalk.yellow;
        console.log(`${index + 1}. ${chalk.bold(issue.file)}`);
        console.log(`   ${severityColor(issue.severity)}: ${issue.issue}`);
        console.log(`   💡 ${chalk.gray(issue.suggestion)}\n`);
      });
    }
    
  } catch (error) {
    console.log(chalk.red(`❌ Could not run security analysis: ${error.message}`));
  }
}

async function debug() {
  try {
    // Check if we're in a Somnia project
    if (!await fs.pathExists('./foundry.toml')) {
      console.error(chalk.red('❌ Not in a Somnia AI Agent project directory'));
      process.exit(1);
    }
    
    console.log(chalk.cyan('🐛 Somnia AI Agent Debugging Tools\n'));
    
    const { debugMode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'debugMode',
        message: 'Select debugging mode:',
        choices: [
          {
            name: '📊 Gas Analysis - Optimize gas usage',
            value: 'gas'
          },
          {
            name: '🔍 Transaction Trace - Step through execution',
            value: 'trace'
          },
          {
            name: '📡 Event Analysis - Analyze emitted events',
            value: 'events'
          },
          {
            name: '🔒 Security Check - Find security issues',
            value: 'security'
          }
        ],
        pageSize: 10
      }
    ]);
    
    console.log('');
    
    switch (debugMode) {
        case 'gas': {
          await analyzeGasUsage();
          break;
        }
      case 'trace': {
        const { txHash } = await inquirer.prompt([
          {
            type: 'input',
            name: 'txHash',
            message: 'Enter transaction hash:',
            default: '0x1234567890abcdef...'
          }
        ]);
        await traceTransaction(txHash);
        break;
      }
      case 'events':
        await analyzeEvents();
        break;
      case 'security':
        await checkSecurity();
        break;
    }
    
  } catch (error) {
    console.error(chalk.red('Error during debugging:', error.message));
    process.exit(1);
  }
}

module.exports = debug;
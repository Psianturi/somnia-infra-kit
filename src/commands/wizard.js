const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const AGENT_FEATURES = {
  staking: {
    name: 'Staking',
    description: 'Allow users to stake tokens and earn rewards',
    code: `
    mapping(address => uint256) public stakes;
    uint256 public totalStaked;
    
    function stake(uint256 amount) external {
        // Staking logic here
        stakes[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }
    event Staked(address indexed user, uint256 amount);
    `
  },
  rewards: {
    name: 'Rewards Distribution',
    description: 'Distribute rewards to users based on activity or staking',
    code: `
    mapping(address => uint256) public rewards;
    
    function distributeReward(address user, uint256 amount) external onlyOwner {
        rewards[user] += amount;
        emit RewardDistributed(user, amount);
    }
    event RewardDistributed(address indexed user, uint256 amount);
    `
  },
  accessControl: {
    name: 'Access Control',
    description: 'Restrict function access to specific roles',
    code: `
    mapping(address => bool) public admins;
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not admin");
        _;
    }
    
    function setAdmin(address user, bool isAdmin) external onlyOwner {
        admins[user] = isAdmin;
        emit AdminSet(user, isAdmin);
    }
    event AdminSet(address indexed user, bool isAdmin);
    `
  },
  priceMonitoring: {
    name: 'Price Monitoring',
    description: 'Monitor token prices and price changes',
    code: `
    uint256 public currentPrice;
    uint256 public priceThreshold;
    
    function updatePrice(uint256 _price) external onlyOwner {
        currentPrice = _price;
        if (_price > priceThreshold) {
            emit PriceThresholdReached(_price);
        }
    }`
  },
  automatedTrading: {
    name: 'Automated Trading',
    description: 'Execute trades based on conditions',
    code: `
    bool public tradingEnabled;
    uint256 public maxTradeSize;
    
    function executeTrade(uint256 amount) external onlyOwner {
        require(tradingEnabled, "Trading disabled");
        require(amount <= maxTradeSize, "Trade too large");
        // Trading logic here
        emit TradeExecuted(amount);
    }`
  },
  multiToken: {
    name: 'Multi-Token Support',
    description: 'Support multiple token pairs',
    code: `
    mapping(address => uint256) public tokenPrices;
    address[] public supportedTokens;
    
    function addToken(address token) external onlyOwner {
        supportedTokens.push(token);
    }`
  },
  governance: {
    name: 'Governance Voting',
    description: 'Participate in DAO governance',
    code: `
    mapping(uint256 => bool) public votes;
    
    function vote(uint256 proposalId, bool support) external onlyOwner {
        votes[proposalId] = support;
        emit VoteCast(proposalId, support);
    }`
  }
};

async function runWizard(projectName) {
  console.log(chalk.cyan(`\n🧙 Somnia AI Agent Customization Wizard\n`));
  console.log(chalk.gray(`Creating personalized agent: ${projectName}\n`));
  
  // Basic agent info
  const basicInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Agent description:',
      default: 'Custom Somnia AI Agent'
    },
    {
      type: 'input',
      name: 'symbol',
      message: 'Agent symbol (3-5 chars):',
      default: 'SMA',
      validate: (input) => input.length >= 3 && input.length <= 5 ? true : 'Symbol must be 3-5 characters'
    }
  ]);
  
  // Feature selection
  const featureChoices = Object.entries(AGENT_FEATURES).map(([key, feature]) => ({
    name: `${feature.name} - ${chalk.gray(feature.description)}`,
    value: key,
    checked: false
  }));
  
  const { selectedFeatures } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedFeatures',
      message: 'Select features to include:',
      choices: featureChoices,
      pageSize: 10
    }
  ]);
  
  // Configuration for selected features
  const featureConfigs = {};
  
  for (const feature of selectedFeatures) {
    if (feature === 'priceMonitoring') {
      const config = await inquirer.prompt([
        {
          type: 'input',
          name: 'updateInterval',
          message: 'Price update interval (seconds):',
          default: '30',
          validate: (input) => !isNaN(input) && parseInt(input) > 0
        },
        {
          type: 'input',
          name: 'threshold',
          message: 'Price threshold percentage:',
          default: '5',
          validate: (input) => !isNaN(input) && parseFloat(input) > 0
        }
      ]);
      featureConfigs.priceMonitoring = config;
    }
    
    if (feature === 'automatedTrading') {
      const config = await inquirer.prompt([
        {
          type: 'input',
          name: 'maxTradeSize',
          message: 'Maximum trade size (in tokens):',
          default: '1000',
          validate: (input) => !isNaN(input) && parseInt(input) > 0
        },
        {
          type: 'input',
          name: 'slippage',
          message: 'Slippage tolerance (%):',
          default: '0.5',
          validate: (input) => !isNaN(input) && parseFloat(input) > 0
        }
      ]);
      featureConfigs.automatedTrading = config;
    }
  }
  
  return {
    basicInfo,
    selectedFeatures,
    featureConfigs
  };
}

function generateCustomContract(projectName, config) {
  const { basicInfo, selectedFeatures } = config;
  
  let contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ${projectName}
 * @dev ${basicInfo.description}
 * @author Somnia AI Agent CLI
 */
contract ${projectName} {
    address public owner;
    bool public isActive;
    uint256 public lastUpdate;
    
    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AgentActivated();
    event AgentDeactivated();
`;

  // Add feature-specific events
  selectedFeatures.forEach(feature => {
    if (feature === 'priceMonitoring') {
      contractCode += `    event PriceThresholdReached(uint256 price);\n`;
    }
    if (feature === 'automatedTrading') {
      contractCode += `    event TradeExecuted(uint256 amount);\n`;
    }
    if (feature === 'governance') {
      contractCode += `    event VoteCast(uint256 proposalId, bool support);\n`;
    }
  });

  contractCode += `
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyActive() {
        require(isActive, "Agent not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        isActive = true;
        lastUpdate = block.timestamp;
        emit AgentActivated();
    }
`;

  // Add feature-specific code
  selectedFeatures.forEach(feature => {
    contractCode += AGENT_FEATURES[feature].code;
  });

  contractCode += `
    function toggleAgent() external onlyOwner {
        isActive = !isActive;
        if (isActive) {
            emit AgentActivated();
        } else {
            emit AgentDeactivated();
        }
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    function getStatus() external view returns (bool active, uint256 lastUpdateTime) {
        return (isActive, lastUpdate);
    }
}`;

  return contractCode;
}

async function createCustomProject(projectName, config) {
  // projectName is now absolute path to target folder
  const targetDir = projectName;
  const nameOnly = path.basename(targetDir);

  // Create project structure
  await fs.ensureDir(path.join(targetDir, 'src'));
  await fs.ensureDir(path.join(targetDir, 'test'));
  await fs.ensureDir(path.join(targetDir, 'script'));

  // Generate custom contract
  const contractCode = generateCustomContract(nameOnly, config);
  await fs.writeFile(path.join(targetDir, 'src', `${nameOnly}.sol`), contractCode);

  // Create foundry.toml
  const foundryConfig = `[profile.default]
  src = "src"
  out = "out"
  libs = ["lib"]
  solc_version = "0.8.19"

  [rpc_endpoints]
  somnia_testnet = "https://dream-rpc.somnia.network"`;
  await fs.writeFile(path.join(targetDir, 'foundry.toml'), foundryConfig);

  // Create basic test
  const testCode = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.19;

  import "forge-std/Test.sol";
  import "../src/${nameOnly}.sol";

  contract ${nameOnly}Test is Test {
    ${nameOnly} public agent;
      
    function setUp() public {
      agent = new ${nameOnly}();
    }
      
    function test_InitialState() public {
      assertTrue(agent.isActive());
      assertEq(agent.owner(), address(this));
    }
      
    function test_ToggleAgent() public {
      agent.toggleAgent();
      assertFalse(agent.isActive());
          
      agent.toggleAgent();
      assertTrue(agent.isActive());
    }
  }`;
  await fs.writeFile(path.join(targetDir, 'test', `${nameOnly}.t.sol`), testCode);

  // Create deployment script
  const deployScript = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.19;

  import "forge-std/Script.sol";
  import "../src/${nameOnly}.sol";

  contract Deploy${nameOnly} is Script {
    function run() external {
      vm.startBroadcast();
          
      ${nameOnly} agent = new ${nameOnly}();
          
      console.log("${nameOnly} deployed at:", address(agent));
          
      vm.stopBroadcast();
    }
  }`;
  await fs.writeFile(path.join(targetDir, 'script', `Deploy.s.sol`), deployScript);

  // Create .gitignore
  await fs.writeFile(path.join(targetDir, '.gitignore'), `.env
  node_modules/
  out/
  cache/
  broadcast/
  lib/`);

  // Create README
  const readme = `# ${nameOnly}

  ${config.basicInfo.description}

  ## Features

  ${config.selectedFeatures.map(f => `- ${AGENT_FEATURES[f].name}`).join('\n')}

  ## Quick Start

  \`\`\`bash
  # Install dependencies
  forge install foundry-rs/forge-std

  # Run tests
  forge test

  # Deploy
  forge script script/Deploy.s.sol --rpc-url somnia_testnet --broadcast
  \`\`\`
  `;
  await fs.writeFile(path.join(targetDir, 'README.md'), readme);
}

module.exports = { runWizard, createCustomProject };
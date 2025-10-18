# Somnia AI Agent CLI

[![npm version](https://badge.fury.io/js/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![npm downloads](https://img.shields.io/npm/dt/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![GitHub release](https://img.shields.io/github/v/release/Psianturi/somnia-infra-kit.svg)](https://github.com/Psianturi/somnia-infra-kit/releases)

A comprehensive CLI tool for developing and deploying Autonomous AI Agents on the Somnia Blockchain. This toolkit provides everything developers need to build, test, and deploy AI agents with just a few commands.

## Key Features

# Uninstall old version

# Somnia AI Agent CLI

A CLI tool for building, testing, and deploying AI Agents on the Somnia Blockchain.

## Features

- Fast project setup and template selection
- Custom agent creation (wizard or AI)
- Built-in test, deploy, and debug commands
- Secure deployment and upgrade tools

## 🚀 Quick Start

```bash
# 1. Create a new agent project
somnia-cli init MyAgent

# 2. Configure environment (RPC, private key)
somnia-cli config

# 3. Run tests
somnia-cli test

# 4. Deploy to Somnia Testnet
somnia-cli deploy

# 5. (Optional) Verify contract
somnia-cli verify <contract-address>
```

## Customization & Templates

- Use `--template` for DeFi/NFT/basic agent
- Use `--wizard` for guided custom agent creation
- Use `custom-agent` for AI-generated contract

## 🧑‍💻 Example: Custom Agent Output

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Try is Ownable, ReentrancyGuard {
   using SafeERC20 for ERC20;
   ERC20 public token;
   mapping(address => uint256) public stakes;
   mapping(address => uint256) public debts;
   // ... rest of contract ...
}
```

## Requirements

- Node.js >= 18.0.0 (recommended: >= 20.0.0)
- Git
- Foundry
- Somnia Testnet (RPC: `https://dream-rpc.somnia.network`, Chain ID: 50312)

## 🤝 Contributing

Contributions are welcome! Technical docs coming soon.

## License

MIT License - see LICENSE file for details.

   function stake(uint256 _amount) external nonReentrant {
      token.safeTransferFrom(msg.sender, address(this), _amount);
      stakes[msg.sender] += _amount;
      emit Staked(msg.sender, _amount);
   }

   function unstake(uint256 _amount) external nonReentrant {
      require(stakes[msg.sender] >= _amount, "Insufficient stake");
      require(debts[msg.sender] == 0, "Outstanding debt");
      stakes[msg.sender] -= _amount;
      token.safeTransfer(msg.sender, _amount);
      emit Unstaked(msg.sender, _amount);
   }

   function borrow(uint256 _amount) external nonReentrant {
      require(stakes[msg.sender] >= _amount, "Insufficient collateral");
      debts[msg.sender] += _amount;
      token.safeTransfer(msg.sender, _amount);
      emit Borrowed(msg.sender, _amount);
   }

   function repay(uint256 _amount) external nonReentrant {
      require(debts[msg.sender] >= _amount, "Exceeding debt");
      token.safeTransferFrom(msg.sender, address(this), _amount);
      debts[msg.sender] -= _amount;
      emit Repaid(msg.sender, _amount);
   }
}
```

## 📋 Requirements & Network

- Node.js >= 18.0.0 (recommended: >= 20.0.0)
- Git
- Foundry
- Somnia Testnet (RPC: `https://dream-rpc.somnia.network`, Chain ID: 50312)

## 🤝 Contributing

Contributions are welcome! Technical documentation coming soon.

## 📄 License

MIT License - see LICENSE file for details.
# Check project status and configuration
somnia-cli status
```

**Sample output:**
```
🔍 Somnia Agent Project Status
📁 Project Directory: ✅ Valid
⚙️  Configuration: ✅ Found
🔨 Foundry: ✅ Installed
📂 Project Structure:
   src/: ✅
   test/: ✅
   script/: ✅
```

### Command Reference

| Command | Description | Example |
|---------|-------------|----------|
| `init <name>` | Create new project (interactive) | `somnia-cli init MyAgent` |
| `init <name> --template <type>` | Create with template | `somnia-cli init Bot --template defi` |
| `init <name> --wizard` | Create with customization wizard | `somnia-cli init Bot --wizard` |
| `config` | Setup environment | `somnia-cli config` |
| `test` | Run test suite | `somnia-cli test` |
| `deploy` | Deploy with auto-verification | `somnia-cli deploy` |
| `verify <address>` | Verify contract | `somnia-cli verify 0x123...` |
| `upgrade` | Update dependencies and templates | `somnia-cli upgrade` |
| `debug` | Interactive debugging tools | `somnia-cli debug` |
| `status` | Check project health | `somnia-cli status` |
| `--help` | Show help | `somnia-cli --help` |

## 📁 Generated Project Structure

**Basic Agent Project:**
```
MyAgent/
├── src/
│   └── AgentContract.sol    # Core agent logic
├── test/
│   └── Agent.t.sol          # Comprehensive test suite
├── script/
│   └── Deploy.s.sol         # Deployment automation
├── lib/
│   └── forge-std/           # Foundry testing library
├── foundry.toml             # Foundry configuration
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

**DeFi Agent Project:**
```
MyDeFiAgent/
├── src/
│   ├── AgentContract.sol    # Basic agent
│   └── DeFiAgent.sol        # Advanced DeFi agent
├── test/
│   ├── Agent.t.sol          # Basic tests (4 tests)
│   └── DeFiAgent.t.sol      # DeFi tests (6 tests)
└── ... (same structure as above)
```

## 🔄 Complete Development Workflow

### For Beginners (Basic Agent)

```bash
# 1. Install CLI
npm install -g somnia-ai-agent-cli

# 2. Create project
somnia-cli init MyFirstAgent
cd MyFirstAgent

# 3. Configure (interactive prompts)
somnia-cli config

# 4. Test (should pass 4 tests)
somnia-cli test

# 5. Deploy
somnia-cli deploy

# 6. Verify (optional)
somnia-cli verify <your-contract-address>
```

### For DeFi Developers (Advanced)

```bash
# 1. Create DeFi agent
somnia-cli init PriceBot --template defi
cd PriceBot

# 2. Configure environment
somnia-cli config

# 3. Test DeFi functionality (10 tests)
somnia-cli test
# Expected: All tests pass including price thresholds

# 4. Customize DeFi logic (optional)
# Edit src/DeFiAgent.sol for your specific needs

# 5. Re-test after changes
somnia-cli test

# 6. Deploy to testnet
somnia-cli deploy

# 7. Monitor deployment
somnia-cli status
```

### For NFT Developers

```bash
# 1. Create NFT trading agent
somnia-cli init NFTBot --template nft
cd NFTBot

# 2. Follow same workflow as above
somnia-cli config
somnia-cli test
somnia-cli deploy
```

## 🔧 Troubleshooting

### Common Issues

**1. "forge not found" error:**
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**2. "Configuration missing" error:**
```bash
# Run config command
somnia-cli config
```

**3. Tests failing:**
```bash
# Check project status
somnia-cli status

# Ensure you're in project directory
cd YourProjectName
somnia-cli test
```

**4. Deployment fails:**
```bash
# Verify configuration
somnia-cli status

# Check if RPC URL and private key are set
cat .env
```


## 🧑‍� Example: Custom Agent Output

Berikut contoh hasil file Solidity dari fitur custom agent:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Try is Ownable, ReentrancyGuard {
   using SafeERC20 for ERC20;

   ERC20 public token;
   mapping(address => uint256) public stakes;
   mapping(address => uint256) public debts;

   event Staked(address indexed user, uint256 amount);
   event Unstaked(address indexed user, uint256 amount);
   event Borrowed(address indexed user, uint256 amount);
   event Repaid(address indexed user, uint256 amount);

   constructor(address _token) {
      token = ERC20(_token);
   }

   function stake(uint256 _amount) external nonReentrant {
      token.safeTransferFrom(msg.sender, address(this), _amount);
      stakes[msg.sender] += _amount;
      emit Staked(msg.sender, _amount);
   }

   function unstake(uint256 _amount) external nonReentrant {
      require(stakes[msg.sender] >= _amount, "Insufficient stake");
      require(debts[msg.sender] == 0, "Outstanding debt");
      stakes[msg.sender] -= _amount;
      token.safeTransfer(msg.sender, _amount);
      emit Unstaked(msg.sender, _amount);
   }

   function borrow(uint256 _amount) external nonReentrant {
      require(stakes[msg.sender] >= _amount, "Insufficient collateral");
      debts[msg.sender] += _amount;
      token.safeTransfer(msg.sender, _amount);
      emit Borrowed(msg.sender, _amount);
   }

   function repay(uint256 _amount) external nonReentrant {
      require(debts[msg.sender] >= _amount, "Exceeding debt");
      token.safeTransferFrom(msg.sender, address(this), _amount);
      debts[msg.sender] -= _amount;
      emit Repaid(msg.sender, _amount);
   }
}
```

## 📋 Requirements & Network

- Node.js >= 18.0.0 (rekomendasi: >= 20.0.0)
- Git
- Foundry
- Somnia Testnet (RPC: `https://dream-rpc.somnia.network`, Chain ID: 50312)

## 🤝 Contributing

Kontribusi sangat terbuka! Dokumentasi teknis segera menyusul.

## 📄 License

MIT License - see LICENSE file for details.


# Somnia AI Agent CLI & Sandbox

[![npm version](https://badge.fury.io/js/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive CLI tool and sandbox environment for developing and deploying Autonomous AI Agents on the Somnia Blockchain. This toolkit provides everything developers need to build, test, and deploy AI agents with just a few commands.

## Key Features

- **Instant Setup**: Bootstrap complete AI Agent projects in seconds
- **Local Testing**: Comprehensive test suite with Foundry integration
- **Secure Deployment**: Encrypted credential management and safe deployment
- **Multiple Templates**: Specialized templates for DeFi, NFT, and basic agents
- **Developer Experience**: Interactive prompts and clear feedback
- **Project Monitoring**: Built-in status checking and contract verification

## Installation

```bash
npm install -g somnia-ai-agent-cli
```

**Verify installation:**
```bash
somnia-cli --version
somnia-cli --help
```

## 🎯 Quick Start Guide

### Step 1: Create Your First Agent
```bash
# Create a basic AI agent project
somnia-cli init MyFirstAgent
cd MyFirstAgent

# Check what was created
ls -la
# Output: src/ test/ script/ foundry.toml .env.example README.md
```

### Step 2: Configure Environment
```bash
# Interactive configuration setup
somnia-cli config
```
**You'll be prompted for:**
- Somnia RPC URL (default: `https://dream-rpc.somnia.network`)
- Private Key (encrypted and stored securely)

### Step 3: Test Your Agent
```bash
# Run comprehensive test suite
somnia-cli test
```
**Expected output:**
```
🧪 Running tests in local sandbox...
[PASS] test_TriggerActionUpdatesTimestamp
[PASS] test_TriggerActionUpdatesData  
[PASS] test_OnlyOwnerCanTriggerAction
[PASS] test_GetAgentStatus
✅ Tests completed successfully!
```

### Step 4: Deploy to Somnia Testnet
```bash
# Deploy your agent contract
somnia-cli deploy
```
**Expected output:**
```
🚀 Deploying AI Agent contract to Somnia Testnet...
📋 Using wallet: 0x53...6586
✅ Deployment completed successfully!
Contract deployed at: 0x1234...5678
```

### Step 5: Verify Contract (Optional)
```bash
# Verify your deployed contract
somnia-cli verify 0x1234...5678
```

## 🛠️ Advanced Usage

### Available Templates

#### 1. Basic Agent Template
```bash
somnia-cli init MyBasicAgent
# Creates: Basic autonomous agent with trigger functionality
```

#### 2. DeFi Price Monitoring Agent
```bash
somnia-cli init MyDeFiAgent --template defi
# Creates: Advanced DeFi agent with price thresholds and trading signals
```

#### 3. NFT Trading Agent
```bash
somnia-cli init MyNFTAgent --template nft
# Creates: NFT floor price monitoring and trading opportunity detection
```

### Testing Different Templates

**Test Basic Agent:**
```bash
cd MyBasicAgent
somnia-cli test
# Runs 4 tests: timestamp, data, access control, status
```

**Test DeFi Agent:**
```bash
cd MyDeFiAgent
somnia-cli test
# Runs 10 tests: price updates, thresholds, signals, access control
```

**Test NFT Agent:**
```bash
cd MyNFTAgent
somnia-cli test
# Runs NFT-specific tests: floor price tracking, collection management
```

### Project Health Monitoring

```bash
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
| `init <name>` | Create new project | `somnia-cli init MyAgent` |
| `init <name> --template <type>` | Create with template | `somnia-cli init Bot --template defi` |
| `config` | Setup environment | `somnia-cli config` |
| `test` | Run test suite | `somnia-cli test` |
| `deploy` | Deploy to testnet | `somnia-cli deploy` |
| `verify <address>` | Verify contract | `somnia-cli verify 0x123...` |
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

## 📊 Testing Results

**Basic Agent Tests:**
- ✅ `test_TriggerActionUpdatesTimestamp` - Validates action timing
- ✅ `test_TriggerActionUpdatesData` - Validates data storage  
- ✅ `test_OnlyOwnerCanTriggerAction` - Security validation
- ✅ `test_GetAgentStatus` - Status retrieval

**DeFi Agent Tests (Additional):**
- ✅ `test_InitialState` - Contract initialization
- ✅ `test_UpdatePrice` - Price update functionality
- ✅ `test_PriceThresholdTrigger` - Buy signal generation
- ✅ `test_SellSignalTrigger` - Sell signal generation
- ✅ `test_OnlyOwnerCanUpdate` - Access control
- ✅ `test_ToggleAgent` - Agent activation/deactivation

## 🌐 Network Configuration

**Somnia Testnet:**
- RPC URL: `https://dream-rpc.somnia.network`
- Chain ID: 50312
- Currency: STT
- Block Explorer: Available through Somnia network

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Git** (for dependency management)
- **Foundry** (automatically detected and used)
- **Somnia Testnet** access with SOM tokens

## 🤝 Contributing

Contributions are welcome! Technical documentation will be available soon.

## 📄 License

MIT License - see LICENSE file for details.

---


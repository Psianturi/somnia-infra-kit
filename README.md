# SOMNIA INFRA KIT

[![npm version](https://badge.fury.io/js/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![npm downloads](https://img.shields.io/npm/dt/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![GitHub release](https://img.shields.io/github/v/release/Psianturi/somnia-infra-kit.svg)](https://github.com/Psianturi/somnia-infra-kit/releases)

**Somnia AI Agent CLI** - A comprehensive CLI tool for developing and deploying Autonomous AI Agents on the Somnia Blockchain. This toolkit provides everything developers need to build, test, and deploy AI agents with just a few commands.

## Key Features

- **Instant Setup**: Bootstrap complete AI Agent projects in seconds
- **Interactive Templates**: Smart template selection with feature preview
- **AI-Powered Custom Agents**: Generate smart contracts using OpenAI GPT integration
- **Multiple Templates**: Specialized templates for DeFi, NFT, and basic agents
- **Built-in Testing**: Comprehensive test suite with Foundry integration
- **Secure Deployment**: Encrypted credential management and auto-verification
- **VS Code Integration**: Syntax highlighting and code snippets


## Installation

```bash
npm install -g somnia-ai-agent-cli@1.0.5
```

**Verify installation:**
```bash
somnia-cli --version
# Expected: 1.0.5

somnia-cli --help
```

## Quick Start Guide

### 1. Create Agent Project
```bash
somnia-cli init MyFirstAgent
cd MyFirstAgent
```

### 2. Configure Environment
```bash
somnia-cli config
# Prompts: RPC URL, Private Key (encrypted)
```

### 3. Test the Agent
```bash
somnia-cli test
# Expected: All tests pass
```

### 4. Deploy to Somnia Testnet
```bash
somnia-cli deploy
# Expected: Contract deployed successfully
```

### 5. Verify Contract (Optional)
```bash
somnia-cli verify <contract-address>
```

## Advanced Features

### Interactive Template Selection
```bash
somnia-cli init MyAgent
# Shows menu: Basic Agent, DeFi Agent, NFT Agent
```

### Customization Wizard
```bash
somnia-cli init MyCustomAgent --wizard
# Guided setup with feature selection
```

### Project Upgrades
```bash
somnia-cli upgrade
# Updates templates and dependencies
```

### Built-in Debugging
```bash
somnia-cli debug
# Gas analysis, transaction tracing, security checks
```

## Available Templates

### 1. Basic Agent
```bash
somnia-cli init MyBasicAgent
# Simple autonomous agent (4 tests)
```

### 2. DeFi Agent
```bash
somnia-cli init MyDeFiAgent --template defi
# Price monitoring & trading signals (10 tests)
```

### 3. NFT Agent
```bash
somnia-cli init MyNFTAgent --template nft
# Floor price tracking & opportunities
```

### 4. Custom AI Agent
```bash
somnia-cli custom-agent
# AI-powered contract generation with OpenAI integration
```

### Project Status Check
```bash
somnia-cli status
# Validates project structure and configuration
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


## Development Workflows

### Basic Agent (Beginners)
```bash
npm install -g somnia-ai-agent-cli
somnia-cli init MyFirstAgent && cd MyFirstAgent
somnia-cli config && somnia-cli test && somnia-cli deploy
```

### DeFi Agent (Advanced)
```bash
somnia-cli init PriceBot --template defi && cd PriceBot
somnia-cli config && somnia-cli test && somnia-cli deploy
```

### NFT Agent
```bash
somnia-cli init NFTBot --template nft && cd NFTBot
somnia-cli config && somnia-cli test && somnia-cli deploy
```


## Testing Results

**Basic Agent Tests (4 tests):**
- `test_TriggerActionUpdatesTimestamp` - Action timing validation
- `test_TriggerActionUpdatesData` - Data storage validation
- `test_OnlyOwnerCanTriggerAction` - Security validation
- `test_GetAgentStatus` - Status retrieval

**DeFi Agent Tests (6 additional tests):**
- `test_InitialState` - Contract initialization
- `test_UpdatePrice` - Price update functionality
- `test_PriceThresholdTrigger` - Buy signal generation
- `test_SellSignalTrigger` - Sell signal generation
- `test_OnlyOwnerCanUpdate` - Access control
- `test_ToggleAgent` - Agent activation/deactivation

## Network Configuration

**Somnia Testnet:**
- RPC URL: `https://dream-rpc.somnia.network`
- Chain ID: 50312
- Currency: STT

## Requirements

- Node.js >= 20.0.0
- Git (for dependency management)
- Foundry (automatically detected)
- Somnia Testnet access with STT tokens

## Ecosystem

### [Somnia InfraKit Website](https://somnia-infrakit.vercel.app)
- Interactive landing page and documentation
- Getting started guides and architecture overview

### [Live Demo Projects](https://github.com/Psianturi/somnia-agents-showcase)
- **DemoBasicAgent**: `0x0ae8b1BF59127693819567f6Fb2EB47Fb7C3BAd4` (Somnia Testnet)
- **DemoDeFiAgent**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (Local deployment)

## Contributing

Contributions are welcome!
---


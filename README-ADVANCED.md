# SOMNIA INFRA KIT - ADVANCED GUIDE

> **Advanced Usage & Best Practices for Somnia AI Agent CLI v1.1.3**

This guide covers advanced features, deployment patterns, security best practices, and troubleshooting for the Somnia AI Agent CLI.

## Table of Contents
- [CLI Installation & Setup](#cli-installation--setup)
- [Project Structure](#project-structure)
- [Agent Templates](#agent-templates)
- [Environment Configuration](#environment-configuration)
- [Testing & Development](#testing--development)
- [Deployment Strategies](#deployment-strategies)
- [Security Best Practices](#security-best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## CLI Installation & Setup

### Global Installation
```bash
npm install -g somnia-ai-agent-cli
somnia-cli --version  # Should show v1.1.3+
```

### Prerequisites
- **Node.js** 16+ 
- **Foundry** (forge, cast)
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

---

## Project Structure

### CLI Structure
```
somnia-agent-cli-sandbox/
├── src/commands/          # CLI command implementations
├── templates/             # Agent templates (basic, defi, nft, yield)
├── agent-template/        # Base template for new agents
├── test/                  # CLI and integration tests
├── utils/                 # Helper utilities
└── docs/                  # Documentation
```

### Generated Project Structure
```
MyAgent/
├── src/                   # Smart contracts
│   └── AgentContract.sol  # Main agent contract
├── test/                  # Foundry test suite
│   └── Agent.t.sol        # Contract tests
├── script/                # Deploy scripts
│   └── Deploy.s.sol       # Deployment script
├── lib/                   # Dependencies (forge-std, OpenZeppelin)
├── foundry.toml           # Foundry configuration
├── setup.sh               # Dependency & build automation
├── .env.example           # Environment template
└── README.md              # Project documentation
```

---

## Agent Templates

### Available Templates
1. **Basic Agent** - Simple trigger functionality
2. **DeFi Agent** - Price monitoring and trading signals
3. **NFT Agent** - Floor price tracking and opportunities
4. **Yield Agent** - Auto-compound farming strategies

### Creating Projects
```bash
# Interactive template selection
somnia-cli init MyAgent

# Specific template
somnia-cli init MyDeFiAgent --template defi
somnia-cli init MyNFTAgent --template nft
somnia-cli init MyYieldAgent --template yield
```

### Template Customization
- All templates use the same proven architecture (owner-controlled agent)
- Extend functionality by modifying `src/AgentContract.sol`
- Add custom logic while maintaining the base trigger pattern

---

## Environment Configuration

### Manual .env Setup
```bash
cd MyAgent
cp .env.example .env
# Edit .env with your values
```

### Required Variables
```bash
# .env file
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
PRIVATE_KEY=your_64_char_hex_private_key_no_0x_prefix
WALLET_ADDRESS=0xYourWalletAddress
```

### Security Notes
- **Never commit .env to git** (already in .gitignore)
- Private key must be 64 hex characters without 0x prefix
- CLI auto-validates and corrects .env format on deploy

---

## Testing & Development

### Setup Dependencies
```bash
cd MyAgent
bash setup.sh  # Installs forge-std, OpenZeppelin, builds contracts
```

### Run Tests
```bash
forge test          # Run all tests
forge test -vvv     # Verbose output
forge test --match-test testTriggerAction  # Specific test
```

### Development Workflow
```bash
# 1. Setup project
somnia-cli init MyAgent && cd MyAgent
bash setup.sh

# 2. Develop & test
# Edit src/AgentContract.sol
forge test

# 3. Deploy
somnia-cli deploy
```

---

## Deployment Strategies

### Standard Deployment
```bash
# Automatic deployment (recommended)
somnia-cli deploy
```

### Advanced Deployment Options
```bash
# Dry-run (prepare tx without broadcasting)
somnia-cli deploy --no-broadcast

# Specific contract and constructor args
somnia-cli deploy --contract src/DeFiAgent.sol:DeFiAgent --constructor-args 100

# Custom gas limit
SOMNIA_GAS_LIMIT=13000000 somnia-cli deploy

# Legacy transaction type
SOMNIA_FORCE_LEGACY=true somnia-cli deploy
```

### Deployment Internals
- Uses `forge create` with broadcast pattern for security
- Reads `PRIVATE_KEY` via `vm.envUint()` in deploy scripts
- Auto-generates `.deployment.json` with contract info
- Supports automatic retry with increased gas on OOG

### Manual Forge Deployment
```bash
# Equivalent low-level command
forge create src/AgentContract.sol:AgentContract \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --gas-limit 13000000
```

---

## Security Best Practices

### Private Key Management
- **Never hardcode private keys** in source code
- Use environment variables or encrypted storage
- Prefer ephemeral keys for CI/testing
- Validate key format (64 hex chars, no 0x)

### Contract Security
- All templates use `onlyOwner` modifier for access control
- Owner is set to deployer address by default
- Event logging for all agent actions
- Comprehensive test coverage included

### Network Security
- Always verify RPC URL format
- Use official Somnia RPC: `https://dream-rpc.somnia.network`
- Validate chain ID (50312 for Somnia Testnet)

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy Agent
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
      
      - name: Install CLI
        run: npm install -g somnia-ai-agent-cli
      
      - name: Setup Project
        run: |
          somnia-cli init TestAgent --template basic
          cd TestAgent
          bash setup.sh
      
      - name: Test
        run: |
          cd TestAgent
          forge test
      
      - name: Deploy
        env:
          SOMNIA_RPC_URL: ${{ secrets.SOMNIA_RPC_URL }}
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
        run: |
          cd TestAgent
          somnia-cli deploy
```

### Environment Variables for CI
```bash
# GitHub Secrets
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
PRIVATE_KEY=64_char_hex_key_no_0x
WALLET_ADDRESS=0xYourAddress
```

---

## Troubleshooting

### Common Issues

#### 1. Dependency Errors
```bash
# Solution: Reinstall dependencies
bash setup.sh
# or manually:
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
forge build
```

#### 2. Private Key Format Errors
```bash
# Error: Invalid private key format
# Solution: Check .env format
# ✅ Correct: PRIVATE_KEY=abcd1234... (64 hex chars, no 0x)
# ❌ Wrong: PRIVATE_KEY=0xabcd1234...
# ❌ Wrong: PRIVATE_KEY="abcd1234..."
```

#### 3. Out of Gas Errors
```bash
# Solution: Increase gas limit
SOMNIA_GAS_LIMIT=13000000 somnia-cli deploy
# or set in .env:
echo "SOMNIA_GAS_LIMIT=13000000" >> .env
```

#### 4. RPC Connection Issues
```bash
# Check RPC URL format
echo $SOMNIA_RPC_URL
# Should be: https://dream-rpc.somnia.network

# Test connection
cast chain-id --rpc-url $SOMNIA_RPC_URL
# Should return: 50312 (0xc488)
```

#### 5. Contract Not Found
```bash
# Error: Could not determine contract to create
# Solution: Ensure contract exists and is built
forge build
ls out/  # Check compiled artifacts
```

### Debug Commands
```bash
# Check CLI version
somnia-cli --version

# Validate project structure
ls -la  # Should see foundry.toml, src/, test/

# Check Foundry installation
forge --version
cast --version

# Test RPC connection
cast chain-id --rpc-url https://dream-rpc.somnia.network

# Check deployment status
cat .deployment.json  # After deployment
```

### Getting Help
- **GitHub Issues**: [somnia-infra-kit/issues](https://github.com/Psianturi/somnia-infra-kit/issues)
- **Documentation**: See main README.md
- **Examples**: Check [somnia-agents-showcase](https://github.com/Psianturi/somnia-agents-showcase)

---

**Version**: 1.1.3  
**Network**: Somnia Testnet (Chain ID: 50312)  
**RPC**: https://dream-rpc.somnia.network

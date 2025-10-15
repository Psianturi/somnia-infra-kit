# 🎯 Usage Guide - Somnia AI Agent CLI

## For Developers

### Quick Start (5 minutes)
```bash
# 1. Install globally
npm install -g @somnia/ai-agent-cli

# 2. Create your first agent
somnia-cli init MyFirstBot
cd MyFirstBot

# 3. Setup environment
somnia-cli config
# Enter: RPC URL and Private Key

# 4. Test locally
somnia-cli test
# Should see: 4 tests passing

# 5. Deploy to testnet
somnia-cli deploy
# Get: Contract address
```

### For Local Development (Without Global Install)
```bash
# Clone repository
git clone https://github.com/Psianturi/somnia-infra-kit
cd somnia-agent-cli-sandbox

# Install dependencies
npm install

# Use locally
node index.js init MyAgent
cd MyAgent
node ../index.js config
node ../index.js test
node ../index.js deploy
```

## For Production Use

### Install from NPM (When Published)
```bash
npm install -g @somnia/ai-agent-cli
somnia-cli --version
```

### Current Development Usage
```bash
# Clone and use directly
git clone https://github.com/Psianturi/somnia-infra-kit
cd somnia-agent-cli-sandbox
npm install

# Create alias for convenience
alias somnia-cli="node $(pwd)/index.js"

# Now use normally
somnia-cli init MyProject
```

## Template Options

### Basic Agent (Beginners)
```bash
somnia-cli init SimpleBot
# Creates: Basic autonomous agent
# Tests: 4 basic functionality tests
# Use case: Learning, simple automation
```

### DeFi Agent (Advanced)
```bash
somnia-cli init DeFiBot --template defi
# Creates: Price monitoring agent
# Tests: 10 comprehensive tests
# Use case: Trading signals, price alerts
```

### NFT Agent (Specialized)
```bash
somnia-cli init NFTBot --template nft
# Creates: NFT floor price tracker
# Tests: NFT-specific functionality
# Use case: NFT trading opportunities
```

## Common Workflows

### Development Cycle
```bash
# 1. Create project
somnia-cli init MyBot --template defi

# 2. Setup
cd MyBot
somnia-cli config

# 3. Develop
# Edit src/DeFiAgent.sol
# Add tests in test/

# 4. Test changes
somnia-cli test

# 5. Deploy when ready
somnia-cli deploy

# 6. Monitor
somnia-cli status
```

### Troubleshooting
```bash
# Check project health
somnia-cli status

# Verify configuration
cat .env

# Re-run config if needed
somnia-cli config

# Check CLI help
somnia-cli --help
```

## Integration with Existing Projects

### Add to Existing Foundry Project
```bash
# In your existing project
npm install -g @somnia/ai-agent-cli

# Initialize in current directory
somnia-cli init . --template defi

# Configure for Somnia
somnia-cli config

# Test Somnia-specific features
somnia-cli test
```

### CI/CD Integration
```yaml
# .github/workflows/deploy.yml
- name: Install Somnia CLI
  run: npm install -g @somnia/ai-agent-cli

- name: Deploy Agent
  run: |
    somnia-cli config --non-interactive
    somnia-cli test
    somnia-cli deploy
```

## Best Practices

### Security
- Never commit `.env` files
- Use encrypted private keys (CLI handles this)
- Test on testnet first

### Development
- Always run `somnia-cli test` before deploy
- Use `somnia-cli status` to check project health
- Keep templates updated

### Production
- Use environment variables for CI/CD
- Verify contracts after deployment
- Monitor gas usage and costs
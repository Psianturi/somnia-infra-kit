# Somnia AI Agent Project

This is a Somnia AI Agent project created with the Somnia CLI.

## Getting Started

1. Configure your environment:
   ```bash
   somnia-cli config
   ```

2. Run tests locally:
   ```bash
   somnia-cli test
   ```

3. Deploy to Somnia Testnet:
   ```bash
   somnia-cli deploy
   ```

## Project Structure

- `src/AgentContract.sol` - Main AI Agent contract
- `test/Agent.t.sol` - Test suite
- `script/Deploy.s.sol` - Deployment script
- `foundry.toml` - Foundry configuration

## Development

Modify `src/AgentContract.sol` to implement your AI Agent logic. The contract includes:
- `triggerAgentAction()` - Function to trigger agent actions
- `getAgentStatus()` - Function to check agent status
- Events for off-chain integration

## Testing

Run `somnia-cli test` to execute the test suite using Foundry.

## 🚀 Quick Start

```bash
# 1. Install all dependencies and build contracts (one command)
bash setup.sh

# 2. Configure your .env (RPC & private key)
somnia-cli config

# 3. Run tests
forge test

# 4. Deploy to Somnia Testnet
somnia-cli deploy
```

## Troubleshooting
- Make sure Foundry (forge) is installed: https://book.getfoundry.sh/getting-started/installation
- If you get dependency errors, rerun `bash setup.sh`
- If you get private key errors, check your .env (must be 64 hex chars, no 0x)
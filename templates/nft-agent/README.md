# NFT Agent Template

This template provides a basic NFT agent contract and minimal test setup.

## Structure
- `src/NFTAgent.sol`: Main contract
- `test/NFTAgent.t.sol`: Minimal test for contract deployment

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

## Usage
Use `somnia-cli init <AgentName>` to generate a new agent project from this template.

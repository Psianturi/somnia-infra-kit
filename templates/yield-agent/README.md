# Yield Agent Template# Yield Agent Template



This template provides a starting point for building a yield-focused agent smart contract using Foundry.This template provides a starting point for building a yield-focused agent smart contract using Foundry.



## Quick Start## Structure

- `src/AgentContract.sol`: Main contract file (minimal yield agent example).

1. Run `bash setup.sh` to install dependencies and build contracts.- `test/Agent.t.sol`: Foundry test for the agent contract.

2. Write tests in `test/Agent.t.sol`.- `script/Deploy.s.sol`: Deployment script for Foundry.

3. Configure your `.env` file with RPC and PRIVATE_KEY.

4. Run `forge test` to test your contract.## Usage

5. Deploy using `somnia-cli deploy`.1. Customize `src/AgentContract.sol` for your yield strategy.

2. Write tests in `test/Agent.t.sol`.
3. Deploy using `forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>`.

## Requirements
- Foundry installed (`forge`, `cast`).
- .env file with RPC and PRIVATE_KEY.

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

See ADVANCED_GUIDE.md for advanced workflows.
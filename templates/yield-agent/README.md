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

## 🚀 Quick Start (updated: use forge create)

This template follows the same deploy pattern used for Basic Agent: prefer `forge create` (EIP-1559) when deploying to Somnia.

```bash
# 1. Install dependencies and build
bash setup.sh
forge build

# 2. Configure .env
somnia-cli config

# 3. Run tests
forge test

# 4. Dry-run deploy (no broadcast)
forge create src/AgentContract.sol:AgentContract --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 -vvvv

# or the CLI dry-run (no --broadcast):
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --gas-limit 13000000

# 5. Broadcast (when ready)
forge create src/AgentContract.sol:AgentContract --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 --broadcast

# or via the CLI wrapper (recommended):
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --gas-limit 13000000 --broadcast
```

If your contract expects constructor parameters, pass them with `--constructor-args` or `--constructor-args-path`.

After broadcasting, verify with `cast receipt <TX_HASH> --rpc-url <SOMNIA_RPC_URL>` and optionally `cast rpc debug_traceTransaction` to inspect constructor execution.

## Troubleshooting
- Make sure Foundry (forge) is installed: https://book.getfoundry.sh/getting-started/installation
- If you get dependency errors, rerun `bash setup.sh`
- If you get private key errors, check your .env (must be 64 hex chars, no 0x)

See ADVANCED_GUIDE.md for advanced workflows.
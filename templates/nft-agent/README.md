# NFT Agent Template

This template provides a basic NFT agent contract and minimal test setup.

## Structure
- `src/NFTAgent.sol`: Main contract
- `test/NFTAgent.t.sol`: Minimal test for contract deployment

## 🚀 Quick Start (updated: use forge create)

Use the same successful deployment pattern as Basic Agent: prefer `forge create` (EIP-1559) on Somnia.

```bash
# 1. Install dependencies and build
bash setup.sh
forge build

# 2. Configure .env
somnia-cli config

# 3. Run tests
forge test

# 4. Dry-run deploy (inspect, no broadcast)
```bash
forge create src/NFTAgent.sol:NFTAgent --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 -vvvv

# or the CLI dry-run (no --broadcast):
node /path/to/somnia-cli/index.js deploy --contract src/NFTAgent.sol:NFTAgent --gas-limit 13000000
```

# 5. Broadcast when ready
```bash
forge create src/NFTAgent.sol:NFTAgent --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 --broadcast

# Or via CLI wrapper (recommended):
node /path/to/somnia-cli/index.js deploy --contract src/NFTAgent.sol:NFTAgent --gas-limit 13000000 --broadcast
```
```

If your contract needs constructor arguments, pass them with `--constructor-args` (space-separated) or `--constructor-args-path <json-file>`.

Always run `cast receipt <TX_HASH> --rpc-url <SOMNIA_RPC_URL>` after broadcasting to confirm on-chain status.

## Troubleshooting
- Make sure Foundry (forge) is installed: https://book.getfoundry.sh/getting-started/installation
- If you get dependency errors, rerun `bash setup.sh`
- If you get private key errors, check your .env (must be 64 hex chars, no 0x)

## Usage
Use `somnia-cli init <AgentName>` to generate a new agent project from this template.

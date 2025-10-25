# Basic Agent Template

A simple autonomous agent template for Somnia Blockchain with basic functionality.

## Features

- ✅ Owner-based access control
- ✅ Agent activation/deactivation
- ✅ Action logging with timestamps
- ✅ Status monitoring

## Quick Start (updated: use forge create)

Important: Somnia Testnet expects deployments using `forge create` (EIP-1559). Avoid `forge script --broadcast` on Somnia.

1. Install dependencies and build

```bash
# Install deps and build
bash setup.sh
forge build
```

2. Run tests

```bash
forge test
```

3. Dry-run deploy (inspects transaction, does NOT broadcast)

```bash
# Dry-run (no funds spent)
forge create src/AgentContract.sol:AgentContract --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 -vvvv

# or use the CLI dry-run (no --broadcast):
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --gas-limit 13000000
```

4. Broadcast deploy (only when ready and funded)

```bash
# Broadcast using EIP-1559 (recommended). Do NOT use --legacy unless explicitly required.
forge create src/AgentContract.sol:AgentContract \
	--rpc-url <SOMNIA_RPC_URL> \
	--private-key <PRIVATE_KEY> \
	--gas-limit 13000000 --broadcast

# Or use the CLI wrapper (preferred for reproducible metadata and .deployment.json):
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --gas-limit 13000000 --broadcast
```

5. Verify on-chain (authoritative)

```bash
# fetch receipt
cast receipt <TX_HASH> --rpc-url <SOMNIA_RPC_URL>

# optional: trace to inspect constructor execution
cast rpc debug_traceTransaction <TX_HASH> '{}' --rpc-url <SOMNIA_RPC_URL>
```

Notes
- The CLI `somnia-cli deploy` in this repo now prefers `forge create` and will use EIP-1559 by default. Use `--legacy` only if you explicitly need type 0 transactions.
- If your contract constructor requires parameters, pass them with `--constructor-args` (space-separated) or `--constructor-args-path <json-file>`.

Examples (constructor args):

```bash
# single string and numeric args example
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --constructor-args 'MyAgent' 42 --gas-limit 13000000 --broadcast

# or provide a JSON file with the ABI-encoded args
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --constructor-args-path ./constructor-args.json --gas-limit 13000000 --broadcast
```

- After broadcasting, always run `cast receipt <tx>` to get the authoritative tx status and gasUsed; the CLI saves a `.deployment.json` file with this information when available.

## Contract Overview

The `BasicAgent` contract provides:

- **performAction()**: Execute agent actions (owner only, when active)
- **toggleAgent()**: Activate/deactivate the agent
- **getAgentStatus()**: Get current agent information

## Events

- `ActionPerformed(string action, uint256 timestamp)`: Emitted when an action is performed
- `AgentActivated(bool active)`: Emitted when agent status changes
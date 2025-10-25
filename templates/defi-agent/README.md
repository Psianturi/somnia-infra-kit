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

## 🚀 Quick Start (updated: use forge create)

Follow the pattern used successfully for the Basic Agent: prefer `forge create` (EIP-1559) for deployments on Somnia.

```bash
# 1. Install all dependencies and build contracts
bash setup.sh
forge build

# 2. Configure your .env (RPC & private key)
somnia-cli config

# 3. Run tests
forge test

# 4. Dry-run deploy (no broadcast)
forge create src/AgentContract.sol:AgentContract --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 -vvvv

# or the CLI dry-run (no --broadcast):
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --gas-limit 13000000

# 5. Broadcast (when ready and funded)
forge create src/AgentContract.sol:AgentContract --rpc-url <SOMNIA_RPC_URL> --private-key <PRIVATE_KEY> --gas-limit 13000000 --broadcast

# or via CLI wrapper (recommended):
node /path/to/somnia-cli/index.js deploy --contract src/AgentContract.sol:AgentContract --gas-limit 13000000 --broadcast
```

If your contract requires constructor parameters, pass them with `--constructor-args` or `--constructor-args-path` when running the CLI or `forge create`.

After broadcasting, run `cast receipt <TX_HASH> --rpc-url <SOMNIA_RPC_URL>` to verify tx status and gasUsed.

## Troubleshooting
- Make sure Foundry (forge) is installed: https://book.getfoundry.sh/getting-started/installation
- If you get dependency errors, rerun `bash setup.sh`
- If you get private key errors, check your .env (must be 64 hex chars, no 0x)
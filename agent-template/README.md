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
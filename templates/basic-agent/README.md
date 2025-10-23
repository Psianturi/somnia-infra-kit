# Basic Agent Template

A simple autonomous agent template for Somnia Blockchain with basic functionality.

## Features

- ✅ Owner-based access control
- ✅ Agent activation/deactivation
- ✅ Action logging with timestamps
- ✅ Status monitoring

## Quick Start

```bash
# Install dependencies
bash setup.sh

# Run tests
forge test

# Deploy to Somnia testnet
forge script script/Deploy.s.sol --rpc-url https://dream-rpc.somnia.network --broadcast
```

## Contract Overview

The `BasicAgent` contract provides:

- **performAction()**: Execute agent actions (owner only, when active)
- **toggleAgent()**: Activate/deactivate the agent
- **getAgentStatus()**: Get current agent information

## Events

- `ActionPerformed(string action, uint256 timestamp)`: Emitted when an action is performed
- `AgentActivated(bool active)`: Emitted when agent status changes
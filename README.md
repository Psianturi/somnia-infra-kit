# SOMNIA INFRA KIT

[![npm version](https://badge.fury.io/js/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![npm downloads](https://img.shields.io/npm/dt/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![GitHub release](https://img.shields.io/github/v/release/Psianturi/somnia-infra-kit.svg)](https://github.com/Psianturi/somnia-infra-kit/releases)

**Somnia AI Agent CLI** is a developer toolkit and CLI for building, testing, and deploying AI-powered smart contract agents on the Somnia Blockchain. It provides ready-to-use templates (basic, DeFi, NFT, yield, custom), automated setup scripts, and a frictionless workflow for both beginners and advanced users. Suitable for rapid prototyping and production deployment.


# Quick Start

```bash
# 0. Install the CLI globally (only once per machine)
npm install -g somnia-ai-agent-cli

# 1. Create a new agent project
somnia-cli init MyAgent
cd MyAgent

# 2. Install dependencies & build (one command)
bash setup.sh

# 3. Create .env 
Create .env manually 
# echo "SOMNIA_RPC_URL=https://dream-rpc.somnia.network" > .env
# echo "PRIVATE_KEY=your_64_char_hex_private_key" >> .env
# echo "WALLET_ADDRESS=your_wallet_address" >> .env

# 4. Run tests
forge test

# 5. Deploy to Somnia Testnet
# Note: deploy now uses `forge create` and the CLI will BROADCAST by default.
# Use `--no-broadcast` for a dry-run (prepare tx but do not send).
somnia-cli deploy

```

### Troubleshooting
- Make sure Foundry (forge) is installed: https://book.getfoundry.sh/getting-started/installation
- If you get dependency errors, rerun `bash setup.sh`
- If you get private key errors, check your .env (must be 64 hex chars, no 0x)

Important notes about deployments
- Templates and deploy scripts were updated to use a safer broadcast pattern: the deploy script reads `PRIVATE_KEY` from `.env` using `vm.envUint("PRIVATE_KEY")`, then calls `vm.startBroadcast(pk)` and wraps constructor calls with `try/catch` so reverts are surfaced and forge can produce signed broadcast artifacts.

---


## 🔗 Advanced Usage & Full Guide
See [README-ADVANCED.md](./README-ADVANCED.md) for advanced features, custom agents, upgrades, and detailed troubleshooting.

---

## 📁 Project Structure

```
somnia-agent-cli-sandbox/
├── agent-template/        # Base agent contract template
├── docs/                 # Documentation and guides
├── node_modules/         # Node.js dependencies (auto-generated)
├── scripts/              # Utility scripts for development
├── src/                  # CLI source code
├── templates/            # All agent templates (basic, defi, nft, yield, etc.)
├── utils/                # Helper utilities
├── .github/              # GitHub Actions and workflow configs
├── .env                  # (gitignored) Local environment config
├── package.json          # NPM package config
├── README.md             # Main documentation (this file)
├── README-ADVANCED.md    # Advanced usage and troubleshooting
└── ...                   # Other config and support files
```

Notes:
- The CLI now prefers `forge create` for Somnia deployments; deploys are broadcast by default. If you want to inspect the prepared transaction without sending it, use `--no-broadcast`.
- The CLI will search upward from the current working directory for a nearby `.env` and load it automatically, so you can run `somnia-cli deploy` from a template folder and it will find `TestAgent/.env`.
- After a deploy attempt the CLI writes `.deployment.json` with: address, txHash, network, timestamp, verified, txStatus, wallet. Use this file for verification, tracking and CI.
- Typical per-project files you will see after `somnia-cli init` and `bash setup.sh` include `foundry.toml`, `script/Deploy.s.sol`, `src/AgentContract.sol`, `broadcast/`, and `cache/`.


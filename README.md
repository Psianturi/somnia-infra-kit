
# SOMNIA INFRA KIT

[![npm version](https://badge.fury.io/js/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![npm downloads](https://img.shields.io/npm/dt/somnia-ai-agent-cli.svg)](https://www.npmjs.com/package/somnia-ai-agent-cli)
[![GitHub release](https://img.shields.io/github/v/release/Psianturi/somnia-infra-kit.svg)](https://github.com/Psianturi/somnia-infra-kit/releases)

**Somnia AI Agent CLI** is a developer toolkit and CLI for building, testing, and deploying AI-powered smart contract agents on the Somnia Blockchain. It provides ready-to-use templates (basic, DeFi, NFT, yield, custom), automated setup scripts, and a frictionless workflow for both beginners and advanced users. Suitable for rapid prototyping and production deployment.


## Quick Start

```bash
# 0. Install the CLI globally (only once per machine)
npm install -g somnia-ai-agent-cli

# 1. Create a new agent project
somnia-cli init MyAgent
cd MyAgent

# 2. Install dependencies & build (one command)
bash setup.sh

# 3. Configure .env (RPC & private key)
somnia-cli config

# 4. Run tests
forge test

# 5. Deploy to Somnia Testnet
somnia-cli deploy
```

### Troubleshooting
- Make sure Foundry (forge) is installed: https://book.getfoundry.sh/getting-started/installation
- If you get dependency errors, rerun `bash setup.sh`
- If you get private key errors, check your .env (must be 64 hex chars, no 0x)

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
- When you run a deployment locally with `forge script ... --broadcast`, Foundry writes artifacts under `broadcast/<script>/<chainId>/run-latest.json` and a cached copy under `cache/` — the CLI reads these to populate `.deployment.json` in the project root.
- After a deploy attempt the CLI will create `.deployment.json` with fields: address, network, timestamp, verified, txStatus, wallet. This file is used by downstream tooling and CI to track deployments.
- Typical per-project files you will see after `somnia-cli init` and `bash setup.sh` include `foundry.toml`, `script/Deploy.s.sol`, `src/AgentContract.sol`, `broadcast/`, and `cache/`.


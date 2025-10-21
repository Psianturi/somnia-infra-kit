# Advanced

> **Advanced Usage: Somnia AI Agent CLI**
This guide covers advanced features, troubleshooting, and best practices for the Somnia AI Agent CLI.

## Table of Contents
- [Project Structure](#project-structure)
- [Custom Agent Templates](#custom-agent-templates)
- [Automated Setup Scripts](#automated-setup-scripts)
- [Environment Variables & Security](#environment-variables--security)
- [Testing & Linting](#testing--linting)
- [Deployment & Verification](#deployment--verification)
- [Troubleshooting](#troubleshooting)

---
## Project Structure
- `src/commands/`: CLI command implementations
- `templates/`: Agent templates (defi, nft, yield, etc.)
- `agent-template/`: Base template for custom agents
- `test/`: CLI and structure tests

## Custom Agent Templates
- Use `somnia-cli create` for interactive or AI-powered agent generation.
- Templates can be extended in `agent-template/` or copied to new folders.

## Automated Setup Scripts
- Each template includes `setup.sh` for dependency install and build.
- Run `bash setup.sh` after copying or initializing a template.

## Environment Variables & Security
- Store secrets in `.env` (never commit to git).
- Required: `SOMNIA_RPC_URL`, `PRIVATE_KEY` (64 hex chars, no 0x prefix).
- CLI auto-validates and corrects `.env` on deploy.

## Testing & Linting
- Run `npm test` for CLI and structure checks.
- Run `npx eslint src/commands` for linting.
- Add more tests in `test/` as needed.

## Deployment & Verification
- Use `somnia-cli deploy` to deploy agents.
- Deployment info saved to `.deployment.json`.
- Auto-verification simulated; see logs for explorer links.

## Troubleshooting
- If a command fails, check `.env` and template structure.
- For missing dependencies, rerun `setup.sh` or `npm install`.
- For advanced debugging, use `somnia-cli debug`.

---
For more, see the main `README.md` or open an issue on GitHub.

# SOMNIA INFRA KIT - ADVANCED GUIDE

Comprehensive guide 

---

## 1. CLI Installation
```bash
npm install -g somnia-ai-agent-cli
somnia-cli --version
```

## 2. Create a New Project
```bash
somnia-cli init MyAgent
cd MyAgent
```

## 3. Dependency & Build
```bash
bash setup.sh
```

## 4. Environment Configuration
```bash
somnia-cli config
# Enter RPC URL and private key (64 hex, no 0x)
```

## 5. Testing
```bash
forge test
```

## 6. Deploy
```bash
somnia-cli deploy
```

## 7. Preflight Validation (Optional)
```bash
bash validate.sh
```

## 8. Advanced Features
- **Custom Agent Wizard:**
  ```bash
  somnia-cli init MyCustomAgent --wizard
  ```
- **AI Contract Generator:**
  ```bash
  somnia-cli init MyAIAgent --template other
  ```
- **Upgrade Project:**
  ```bash
  somnia-cli upgrade
  ```
- **Verify Contract:**
  ```bash
  somnia-cli verify <contract-address>
  ```
- **Debugging:**
  - Check .env, dependencies, and CLI error logs
  - Use `bash setup.sh` to repair dependencies

## 9. Project Structure
- `src/` - Main smart contract
- `test/` - Foundry test suite
- `script/` - Deploy script
- `foundry.toml` - Foundry config
- `setup.sh` - Dependency & build automation
- `validate.sh` - Preflight check

## 10. Full Troubleshooting
- **Dependency errors:** Rerun `bash setup.sh`
- **Private key errors:** Check .env (64 hex, no 0x)
- **Build errors:** Check Solidity version in foundry.toml (`solc_version = '0.8.20'`)
- **Deploy errors:** Check wallet balance, RPC, and .env format

---

For more questions, see the repo documentation or contact the maintainer.

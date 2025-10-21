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

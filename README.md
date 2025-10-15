# Somnia AI Agent CLI & Sandbox

A comprehensive CLI tool and sandbox environment for developing and deploying Autonomous AI Agents on the Somnia Blockchain.

##  Features

- **Project Initialization**: Quickly bootstrap new AI Agent projects with Foundry templates
- **Local Testing**: Run comprehensive tests in a local sandbox environment
- **Easy Deployment**: Deploy contracts directly to Somnia Testnet
- **Configuration Management**: Securely manage RPC URLs and private keys
- **Interactive Setup**: User-friendly prompts for configuration

## 📦 Installation

```bash
npm install -g somnia-cli
```

## 🛠️ Usage

### Initialize a New Project

```bash
somnia-cli init MyDeFiAgent
```

This creates a new project directory with:
- Foundry configuration (`foundry.toml`)
- Basic AI Agent contract (`src/AgentContract.sol`)
- Test suite (`test/Agent.t.sol`)
- Deployment script (`script/Deploy.s.sol`)

### Configure Environment

```bash
cd MyDeFiAgent
somnia-cli config
```

Interactive setup for:
- Somnia RPC URL
- Private key (stored securely in `.env`)

### Run Tests

```bash
somnia-cli test
```

Executes the Foundry test suite locally.

### Deploy to Testnet

```bash
somnia-cli deploy
```

Deploys the contract to Somnia Testnet using configured credentials.

##  Project Structure

```
somnia-agent-cli/
├── index.js                 # CLI entry point
├── commands/
│   ├── init.js             # Project initialization
│   ├── test.js             # Test execution
│   ├── deploy.js           # Contract deployment
│   └── config.js           # Configuration management
└── agent-template/         # Foundry project template
    ├── src/
    │   └── AgentContract.sol
    ├── test/
    │   └── Agent.t.sol
    ├── script/
    │   └── Deploy.s.sol
    ├── foundry.toml
    ├── .env.example
    └── README.md
```

##  Development Workflow

1. **Install CLI globally**:
   ```bash
   npm install -g somnia-cli
   ```

2. **Create new project**:
   ```bash
   somnia-cli init MyAgent
   cd MyAgent
   ```

3. **Configure environment**:
   ```bash
   somnia-cli config
   ```

4. **Develop your agent**:
   - Modify `src/AgentContract.sol`
   - Add tests in `test/Agent.t.sol`

5. **Test locally**:
   ```bash
   somnia-cli test
   ```

6. **Deploy to testnet**:
   ```bash
   somnia-cli deploy
   ```

##  Requirements

- Node.js >= 20
- Foundry (automatically handled by CLI)
- Somnia Testnet access

## 🤝 Contributing

Contributions are welcome!

## 📄 License

MIT

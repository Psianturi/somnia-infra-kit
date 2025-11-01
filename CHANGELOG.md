# Changelog

All notable changes to this project will be documented in this file.

## [1.1.2] - 2025-11-01

### Fixed
- Add sanitization to wizard-generated contracts for consistent code quality
- Fix deploy script template to use `vm.envString` and `vm.parseUint` for proper private key handling
- Ensure wizard-generated agents have same post-processing as AI-generated agents
- Fix deployment issues where forge script was not receiving private key properly

## [1.1.1] - 2025-10-31

### Added
- Deploy hardening with on-chain receipt validation
- Automatic retry logic for out-of-gas deployments
- Broadcast artifact parsing with fallback mechanisms
- `.deployment.json` persistence for deployment records

### Fixed
- Sanitize AI-generated Solidity code (pragmas, SPDX, imports)
- Remove markdown fences from AI-generated contracts
- Prevent duplicate pragmas and SPDX declarations

## [1.1.0] - Initial Release

### Features
- CLI for creating Somnia AI Agents
- Template selection (Basic, DeFi, NFT, Yield)
- Wizard for custom agent creation
- AI-powered contract generation
- Deploy to Somnia Testnet

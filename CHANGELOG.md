# Changelog

## [1.0.11] - 2024-10-24

### Added
- Post-processing agent for AI-generated custom contracts to fix common compilation errors
- Improved wizard agent stability (no AI dependency)
- Enhanced error handling in custom agent generation

### Fixed
- Custom agent compilation errors due to missing Ownable constructor, isActive property, and events
- Wizard agent creation issues with invalid contract names
- Template creation paths corrected for proper project initialization

### Changed
- Updated README with alternative deployment instructions
- Integrated regex-based fixes as fallback for AI code post-processing

## [1.0.0] - 2024-01-15

### Added
- Enhanced security with private key encryption
- New `status` command for project health checks
- Lazy loading for better performance
- Input validation and sanitization
- ESLint configuration for code quality
- Basic CLI test suite
- Better error handling and user feedback

### Changed
- Package name changed to `@somnia/agent-cli` (scoped)
- Improved CLI interface with more options
- Updated RPC URL to `https://dream-rpc.somnia.network`
- Enhanced project initialization with validation

### Security
- Fixed path traversal vulnerability (CWE-22)
- Implemented private key encryption
- Added input validation for all user inputs
- Secure file permissions for .env files

### Fixed
- Module loading optimization
- Better Foundry binary detection
- Improved error messages and handling

## [1.0.10] - 2025-10-23

### Fixed
- Sanitize AI-generated contract output to remove Markdown fences, duplicate SPDX/pragma lines, and embedded/duplicated content that caused Solidity parse errors.
- Enforce `pragma solidity ^0.8.20` and normalize OpenZeppelin import paths (security -> utils) in generated templates.
- Ensure generator always rewrites the contract file after creation (applies sanitizer to wizard and AI outputs).
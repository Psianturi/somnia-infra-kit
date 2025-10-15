# Changelog

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
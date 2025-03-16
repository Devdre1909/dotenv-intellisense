# Changelog

All notable changes to the "dotenv-intellisense" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-03-16

### Added
- **Variable Value Preview**
  - Implemented hover provider to show environment variable values
  - Added source file tracking in variable definitions
  - Created value masking system for sensitive data
  - Added configurable masking behavior

- **Smart Validation System**
  - Real-time validation service for environment variables
  - Warning system for undefined variables
  - Detection and reporting of duplicate variable definitions
  - Configurable .env file pattern detection
  - Live validation updates on document changes

- **Configuration Options**
  - `dotenv-intellisense.maskValues`: Toggle value masking (default: true)
  - `dotenv-intellisense.sensitivePatterns`: Define sensitive data patterns
    - Default patterns: ["key", "password", "token", "secret"]
  - `dotenv-intellisense.maxFiles`: Control maximum files to scan (default: 10)
  - `dotenv-intellisense.filePatterns`: Customize .env file patterns
    - Default patterns: ["**/.env", "**/.env.*"]
  - `dotenv-intellisense.excludedDirs`: Set directory exclusions
    - Default: ["**/node_modules/**"]

### Changed
- **Architecture Improvements**
  - Enhanced `EnvKeys` class with better source tracking
  - Modularized codebase with separate providers and services
  - Improved completion provider efficiency
  - Better integration with VS Code's IntelliSense system

- **Documentation**
  - Added comprehensive configuration documentation
  - Included feature documentation with examples
  - Created detailed implementation plan
  - Updated README with new features and usage instructions

### Fixed
- Reduced interference with other IntelliSense providers
  - Now only triggers on specific patterns
  - Better context awareness for suggestions
- Improved performance with large .env files
  - Added file scanning limits
  - Implemented efficient caching
- Enhanced duplicate variable handling
  - Better source tracking
  - Clearer duplicate notifications

### Security
- Added sensitive value masking system
- Implemented configurable patterns for sensitive data
- Protected sensitive environment variables in hover displays

## [0.0.4] - Initial Release

### Added
- Basic environment variable completion
- Support for multiple .env files
- Initial documentation and setup

### Notes
- For detailed information about configuration options, see the README.md
- For implementation details and future plans, see docs/FUTUREPLANS.md

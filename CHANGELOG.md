# Change Log

All notable changes to the "dotenv-intellisense" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2024-03-21

### Added
- Variable value preview on hover
  - Shows variable values with optional masking for sensitive data
  - Displays source file information
  - Shows variable type information

- Smart validation features
  - Real-time validation of environment variables
  - Warning system for undefined variables
  - Detection and reporting of duplicate variables
  - Configurable .env file pattern detection

- Enhanced configuration options
  - `dotenv-intellisense.maskValues`: Control value masking
  - `dotenv-intellisense.sensitivePatterns`: Configure sensitive data patterns
  - `dotenv-intellisense.maxFiles`: Set maximum files to scan
  - `dotenv-intellisense.filePatterns`: Custom .env file patterns
  - `dotenv-intellisense.excludedDirs`: Directory exclusion patterns

### Changed
- Improved environment variable tracking with source file information
- Updated completion provider to be more efficient
- Enhanced documentation with new features and configuration options

### Fixed
- Reduced interference with other IntelliSense providers
- Improved performance with large .env files
- Better handling of duplicate variables

## [0.0.4] - Initial Release

- Basic environment variable completion
- Support for multiple .env files
- Initial documentation

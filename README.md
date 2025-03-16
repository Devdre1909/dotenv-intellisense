# Intellisense for env keys in your Javascript

A Visual Studio Code extension that provides auto-completions from contents found in your .env files within your Workspace.

## Features

- Gives you auto-completion for env keys defined in your workspaces
- Shows environment variable values and source files on hover
- Validates environment variable usage and warns about undefined variables
- Detects duplicate environment variable definitions
- Automatically masks sensitive values (configurable)
- Command to manually re-cache env keys definitions if needed

## Supported Languages

- JavaScript
- TypeScript
- JavaScript React (.jsx)
- JavaScript React (.tsx)
- Vue

## Usage

This extension activates when .env files are found in your workspace. It automatically:
- Scans for .env files in your workspace
- Provides IntelliSense suggestions for `process.env.*`
- Shows hover information for environment variables
- Validates environment variable usage

You can also execute the command "Dotenv: Cache Again" via `Ctrl+Shift+P` to refresh the cache.

## Configuration

The extension can be customized through VS Code settings:

- `dotenv-intellisense.debug`: Enable additional logging (default: false)
- `dotenv-intellisense.maskValues`: Mask sensitive environment variable values in hover tooltips (default: true)
- `dotenv-intellisense.sensitivePatterns`: Patterns to identify sensitive variables that should be masked (default: ["key", "password", "token", "secret"])
- `dotenv-intellisense.maxFiles`: Maximum number of .env files to scan (default: 10)
- `dotenv-intellisense.filePatterns`: Glob patterns to identify .env files (default: ["**/.env", "**/.env.*"])
- `dotenv-intellisense.excludedDirs`: Directories to exclude from scanning (default: ["**/node_modules/**"])

## Features

### Auto-Completion
Provides intelligent suggestions for environment variables when typing `process.env.`

### Hover Information
Hover over any `process.env.*` variable to see:
- Current value (masked for sensitive data)
- Source .env file
- Variable type

### Validation
- Warns about undefined environment variables
- Highlights duplicate variable definitions
- Shows source files for duplicates

## Future Plans

- Provide user settings to override .env files to be cached
- Add support for more programming languages
- Implement additional validation rules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Intellisense for env keys in your Javascript

A Visual Studio Code extension that provides auto-completions from contents found in your .env files within your Workspace.

## Features

- Gives you auto-completion for env keys defined in your workspaces, can scan up to 10 env files
- Command to manually re-cache env keys definitions if need be

![DotenvDemo](/images/demo.gif)

## Supported Language

- JavaScript
- JavaScript React (.jsx)
- JavaScript React (.tsx)
- Vue

## Usage

This extension starts up when .env files are founded in your workspace, it's automatically starts up, looks for up to 10 env in your workspace and caches the contents in it. Also, you can execute a command by `Ctrl+Shift+p` and then type "Dotenv: Cache Again"

## Future Plans

- Provide user settings to override .env files to be cache

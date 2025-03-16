import * as vscode from "vscode";
import { EnvKeys } from "../envKey";

export class EnvHoverProvider implements vscode.HoverProvider {
  constructor(private envKeys: EnvKeys[]) {}

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const word = document.getText(range);
    const line = document.lineAt(position.line).text;

    // Check if we're hovering over a process.env.* variable
    const processEnvMatch = line.match(/process\.env\.([A-Za-z0-9_]+)/);
    if (!processEnvMatch || !line.includes(word)) {
      return null;
    }

    const envVar = this.envKeys.find((key) => key.key === word);
    if (!envVar) {
      return new vscode.Hover([
        new vscode.MarkdownString(
          `⚠️ Environment variable \`${word}\` is not defined in any .env file`
        ),
      ]);
    }

    // Check if value should be masked
    const config = vscode.workspace.getConfiguration("dotenv-intellisense");
    const shouldMask = config.get<boolean>("maskValues", true);
    const sensitivePatterns = config.get<string[]>("sensitivePatterns", [
      "key",
      "password",
      "token",
      "secret",
    ]);

    const isSensitive = sensitivePatterns.some((pattern) =>
      word.toLowerCase().includes(pattern.toLowerCase())
    );

    const value =
      isSensitive && shouldMask
        ? "*".repeat(envVar.value.length)
        : envVar.value;

    const markdownContent = new vscode.MarkdownString();
    markdownContent.appendCodeblock(`${envVar.key}=${value}`, "env");
    markdownContent.appendMarkdown(`\n\n**Source:** \`${envVar.fileName}\``);
    markdownContent.appendMarkdown(`\n\n**Type:** \`${typeof envVar.value}\``);

    return new vscode.Hover(markdownContent);
  }
}
